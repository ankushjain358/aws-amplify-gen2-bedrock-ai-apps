"use client";

import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json"

Amplify.configure(outputs, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}

// Reference: https://docs.amplify.aws/nextjs/build-a-backend/server-side-rendering/#configure-amplify-library-for-client-side-usage