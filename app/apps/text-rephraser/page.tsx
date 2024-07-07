"use client"

import { Authenticator } from "@aws-amplify/ui-react"
import '@aws-amplify/ui-react/styles.css';


function TextRephraserComponent() {
    return (<></>);
}

export default function TextRephraser() {

    return (
        <div className="flex-grow bg-gray-100 px-6 sm:px-16 py-8">
            <Authenticator>
                <TextRephraserComponent />
            </Authenticator>
        </div>
    );
}
