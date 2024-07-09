import { Schema } from '../../data/resource';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export const handler: Schema['rephraseText']['functionHandler'] = async (event, context) => {

    try {
        const client = new BedrockRuntimeClient();
        const modelId = process.env.BEDROCK_MODEL_ID;

        const text = event.arguments.text;
        const context = event.arguments.context;

        const systemPrompt = [
            "You are Claude, an AI assistant created by Anthropic to be helpful, harmless, and honest.",
            "Your goal is to provide informative and substantive responses to queries while avoiding potential harms."
        ];

        // Define the base instructions for the LLM
        const baseInstructions = [
            "Please rephrase the following text while maintaining its original meaning.",
            "If context is provided, incorporate it while doing rephrasing to make the content more meaningful.",
            "Below are some useful pieces of information that you can use when generating captions.",
        ];

        // Add the image context information
        const contextInfo = context
            ? `- Text context: ${context}`
            : "- Text context is not available";

        // Add additional instructions
        const additionalInstructions = [
            "Additional instructions:",
            "1. If the text is inappropriate (e.g., contains violence or harmful content), return an error message that can be shown to the user.",
            "2. If the text is appropriate, rephrase it. Format the response using the following HTML structure.",
            "3. There are only two cases: ",
            "   - Positive case: Return the response in the HTML template format provided below.",
            "   - Negative case: Return only the error message.",
            "4. In the positive case, include two elements:",
            "   - A one-liner summary of the original text.",
            "   - The rephrased text, which may span multiple paragraphs if necessary."
        ];


        const responseTemplate = `Here is the response HTML template\n
        <div class="mb-2 text-base font-semibold text-gray-900 dark:text-white">
            <!-- Description goes here -->
        </div>
        <div class="w-full space-y-1dark:text-gray-400">
            <!-- Rephrased text -->
        </ul>`

        const textInfo = `Here is the text to be rephrased: ${text}`;

        // Combine all parts into the final prompt array
        const userPrompt = [
            ...baseInstructions,
            contextInfo,
            ...additionalInstructions,
            responseTemplate,
            textInfo
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