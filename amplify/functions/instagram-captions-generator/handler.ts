import { Schema } from '../../data/resource';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client()

export const handler: Schema['generateInstagramCaptions']['functionHandler'] = async (event, context) => {

    try {
        const client = new BedrockRuntimeClient();
        const bucketName = process.env.S3_BUCKET_NAME;
        const modelId = process.env.BEDROCK_MODEL_ID;

        const numberOfCaptions = event.arguments.captionCount;
        const imageContext = event.arguments.context;
        const includeEmojis = event.arguments.includeEmojis;

        const file = await s3Client.send(new GetObjectCommand({
            Bucket: bucketName,
            Key: event.arguments.s3Key
        }));

        const imageBase64 = `${await file.Body?.transformToString('base64')}`;

        const systemPrompt = [
            "You are Claude, an AI assistant created by Anthropic to be helpful, harmless, and honest.",
            "Your goal is to provide informative and substantive responses to queries while avoiding potential harms."
        ];

        // Define the base instructions for the LLM
        const baseInstructions = [
            "Generate creative, engaging, and relevant Instagram captions for the given image.",
            "If image context is provided, incorporate it into the captions to make them more meaningful and appealing.",
            "Ensure the captions are suitable for a broad audience and capture the essence of the image.",
            "Below are some useful pieces of information that you can use when generating captions.",
            // "Images may contain human faces, you don't need to identify them, for you they are anonymous person. You just need to focus on generating captions."
        ];

        // Add the image context information
        const contextInfo = imageContext
            ? `1. Image context: ${imageContext}`
            : "1. Image context is not available";

        // Add the number of captions to generate
        const captionsInfo = `2. Number of captions to generate: ${numberOfCaptions}`;

        // Add whether to include emojis in the captions
        const emojisInfo = includeEmojis
            ? "3. Include emojis in the captions."
            : "3. Do not include emojis in the captions.";

        const hashtagInfo = "4. Include 2 to 3 hashtags as well.";

        // Add additional instructions
        const additionalInstructions = [
            "Additional instructions:",
            "1. If the image is inappropriate (e.g., contains violence or nudity), return an error message that can be shown to the user.",
            "2. If the image is suitable, generate a description and a list of suggested captions for the given picture. Format the response using the following HTML structure.",
            "3. So for you there are just 2 cases. First, positive, where you will return  response in below HTML template format, second is negative, where you return only error message."
        ];

        const responseTemplate = `Here is the response HTML template\n
        <div class="mb-2 text-base font-semibold text-gray-900 dark:text-white">
        <!-- Description goes here -->
        </div>
        <ul class="w-full space-y-1 list-disc list-inside dark:text-gray-400">
            <li> <!-- Caption 1 --> </li>
            <li> <!-- Caption 2 --> </li>
            <li> <!-- Caption 3 --> </li>
            <!-- More captions as needed -->
        </ul>`

        // Combine all parts into the final prompt array
        const userPrompt = [
            ...baseInstructions,
            contextInfo,
            captionsInfo,
            emojisInfo,
            hashtagInfo,
            ...additionalInstructions,
            responseTemplate
        ];

        // Prepare the payload for the anthropic.claude-3-haiku-20240307-v1:0 model
        // Reference: Multimodal prompts - https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages.html
        const payload = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 1024,
            system: systemPrompt.join("\n"),
            messages: [{
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": `${imageBase64}`,
                        }
                    },
                    {
                        "type": "text",
                        "text": userPrompt.join("\n")
                    }
                ]
            }]
        };

        // Invoke model
        const command = new InvokeModelCommand({
            modelId: modelId,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify(payload),
        });
        const response = await client.send(command);
        const decodedResponseBody = new TextDecoder().decode(response.body);
        const data = JSON.parse(decodedResponseBody);
        const bedrockResponse = data.content[0].text

        return { content: bedrockResponse };
    } catch (e) {
        console.log("Exception");
        console.log(e);
        console.log("Incoming event");
        console.log(event);
        return { content: "An unexpected error has occured while processing your request." };
    }
};