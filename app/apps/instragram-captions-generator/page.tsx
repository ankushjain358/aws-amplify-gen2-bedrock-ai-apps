"use client"

import { Authenticator } from "@aws-amplify/ui-react"
import '@aws-amplify/ui-react/styles.css';


function InstagramCaptionsGeneratorComponent() {
    return (<></>);
}

export default function InstagramCaptionsGenerator() {

    return (
        <div className="flex-grow bg-gray-100 px-6 sm:px-16 py-8">
            <Authenticator>
                <InstagramCaptionsGeneratorComponent />
            </Authenticator>
        </div>
    );
}
