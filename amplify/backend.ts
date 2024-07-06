import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { instagramCaptionsGenerator } from './functions/instagram-captions-generator/resource';
import { textRephraser } from './functions/text-rephraser/resource';
/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
  auth,
  data,

  // lambda functions
  instagramCaptionsGenerator,
  textRephraser
});
