
export interface MenuItem {
    title: string;
    path: string;
}

export interface App extends MenuItem {
    description: string;
}

interface IAppConstants {
    AppName: string,
    AppDescription: string,
    TopLevelMenuItems: MenuItem[]
    Apps: App[]
}

export class AppNames {
    static readonly TEXT_REPHRASER = "Text Rephraser";
    static readonly INSTAGRAM_CAPTIONS_GENERATOR = "Instragram Captions Generator";
};

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
            title: AppNames.TEXT_REPHRASER,
            description: "Use AI to rephrase text",
            path: "/apps/text-rephraser"
        },
        {
            title: AppNames.INSTAGRAM_CAPTIONS_GENERATOR,
            description: "Use AI to generate captions for Instagram posts",
            path: "/apps/instragram-captions-generator"
        }
    ]
}