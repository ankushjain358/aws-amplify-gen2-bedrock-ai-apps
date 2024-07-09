"use client";

import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json"
import { Hub } from "aws-amplify/utils";
import EventService from "@/utils/EventService";

Amplify.configure(outputs, { ssr: true });

// Reference: https://docs.amplify.aws/nextjs/build-a-backend/server-side-rendering/#configure-amplify-library-for-client-side-usage
export default function ConfigureAmplifyClientSide() {

  const SubscribeAuthEvents = () => {
    // Listen to the auth events
    Hub.listen('auth', ({ payload }) => {

      // create and disptach all events
      EventService.publish(payload.event, { message: payload.message });

      switch (payload.event) {
        case 'signedIn':
          console.log('user have been signedIn successfully.');
          break;
        case 'signedOut':
          console.log('user have been signedOut successfully.');
          break;
        case 'tokenRefresh':
          console.log('auth tokens have been refreshed.');
          break;
        case 'tokenRefresh_failure':
          console.log('failure while refreshing auth tokens.');
          break;
        case 'signInWithRedirect':
          console.log('signInWithRedirect API has successfully been resolved.');
          break;
        case 'signInWithRedirect_failure':
          console.log('failure while trying to resolve signInWithRedirect API.');
          break;
        case 'customOAuthState':
          console.log('custom state returned from CognitoHosted UI');
          break;
      }
    });
  }

  SubscribeAuthEvents();

  return null;
}
