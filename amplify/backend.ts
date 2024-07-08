import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { instagramCaptionsGenerator } from './functions/instagram-captions-generator/resource';
import { textRephraser } from './functions/text-rephraser/resource';
import { storage } from './storage/resource';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Stack } from 'aws-cdk-lib';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,

  // lambda functions
  instagramCaptionsGenerator,
  textRephraser
});


const modelId = "anthropic.claude-3-haiku-20240307-v1:0"
const s3Bucket = backend.storage.resources.bucket

// lambda functions
const instagramCaptionsGeneratorLambdaFunction = backend.instagramCaptionsGenerator.resources.lambda as Function
const textRephraserLambdaFunction = backend.textRephraser.resources.lambda as Function

// Instagram captions generator Lambda function permissions
instagramCaptionsGeneratorLambdaFunction.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:InvokeModel"],
    resources: [
      `arn:aws:bedrock:${Stack.of(backend.storage.resources.bucket).region}::foundation-model/${modelId}`,
    ],
  }),
)
instagramCaptionsGeneratorLambdaFunction.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["s3:GetObject"],
    resources: [
      `${s3Bucket.bucketArn}/temp-files/*`,
    ],
  }),
)

instagramCaptionsGeneratorLambdaFunction.addEnvironment('BEDROCK_MODEL_ID', modelId);
instagramCaptionsGeneratorLambdaFunction.addEnvironment('S3_BUCKET_NAME', s3Bucket.bucketName);

s3Bucket.grantRead(instagramCaptionsGeneratorLambdaFunction.role!, 'temp-files/*');