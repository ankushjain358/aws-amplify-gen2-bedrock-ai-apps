export interface App {
    title: string;
    description: string;
    path: string;
}
export interface MenuItem {
    title: string;
    path: string;
}

interface IAppConstants {
    AppName: string,
    AppDescription: string,
    TopLevelMenuItems: MenuItem[]
    Apps: App[]
}

export const AppConstants: IAppConstants = {
    AppName: "Amplify AI Apps",
    AppDescription: "Full-Stack AI Apps with AWS Amplify Gen2 and Amazon Bedrock",
    TopLevelMenuItems: [
        {
            title: "Home",
            path: "/"
        },
        {
            title: "About",
            path: "/about"
        }
    ],
    Apps: [
        {
            title: "Text Rephraser",
            description: "Use AI to rephrase text",
            path: "/apps/text-rephraser"
        },
        {
            title: "Instragram Captions Generator",
            description: "Use AI to generate captions for Instagram posts",
            path: "/apps/instragram-captions-generator"
        }
    ]
}