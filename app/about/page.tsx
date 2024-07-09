import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { AppConstants } from "@/utils/AppConstants";
import { GithubIcon } from "lucide-react";
import Link from "next/link";

export default function About() {
    return (
        <div className="flex-grow bg-gray-100 px-6 sm:px-16 py-8">
            <Card className="w-full p-10">
                <CardHeader>
                    <CardTitle>About {AppConstants.AppName} </CardTitle>
                    <CardDescription>
                        {AppConstants.AppDescription}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-5">
                        This is a simple app that demonstrates how to build Generative AI apps with AWS Amplify Gen2 and Amazon Bedrock.
                    </p>
                    <p className="mb-5">
                        This app uses the following technologies:
                        <ul className="w-full space-y-1 list-disc list-inside dark:text-gray-400 mt-2">
                            <li>AWS Amplify Gen2</li>
                            <li>Amazon Bedrock</li>
                            <li>AWS CDK</li>
                            <li>Next.js</li>
                            <li>React</li>
                            <li>TypeScript</li>
                            <li>Shadcn UI</li>
                        </ul>
                    </p>
                    <p className="mb-5 flex">
                        The source code for this application is available on <b className="mx-2">GitHub</b> at <Link className="ms-2 text-purple-800" href={AppConstants.AppGitHubUrl} target="_blank">{AppConstants.AppGitHubUrl}</Link>.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
