"use client"

import { Schema } from "@/amplify/data/resource";
import { Authenticator, Input } from "@aws-amplify/ui-react"
import { StorageManager, StorageImage } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from "aws-amplify/api";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppConstants, AppNames } from "@/utils/AppConstants";
import Link from "next/link";
import { ArrowLeftCircle, Loader2 } from "lucide-react";
import notificationService from "@/utils/NotificationService";
import commonService from "@/utils/CommonService";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


function InstagramCaptionsGeneratorComponent() {

    const client = generateClient<Schema>()
    const storageManagerRef = React.useRef<any>(null);
    const [apiResponse, setApiResponse] = React.useState<string>("");

    // 1. Define  schema.
    const formSchema = z.object({
        context: z.string().max(50, {
            message: "Context must be at less than 50 characters.",
        }),
        s3Key: z.string().min(1, "Please upload the file"),
        captionCount: z.coerce.number().int().gte(1).lte(10),
        includeEmojis: z.boolean(),
    });

    // 2. Create from from the schema
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            context: "",
            s3Key: "",
            captionCount: 5,
            includeEmojis: true
        },
    });
    const { formState: { isSubmitting } } = form;

    // 3. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        const { data, errors } = await client.queries.generateInstagramCaptions({
            s3Key: values.s3Key,
            context: values.context,
            captionCount: values.captionCount,
            includeEmojis: values.includeEmojis
        });

        if (errors?.length! > 0) {
            notificationService.errors(errors!.map(error => error.message));
            return;
        }

        setApiResponse(data?.content!);
    }

    const processFile = (params: any): any => {

        const fileExtension = params.file.name.split('.').pop();
        const s3Key = `${commonService.generateRandomString()}.${fileExtension}`;

        return {
            file: params.file,
            key: s3Key
        };
    };


    return (
        <>
            <div className="flex flex-col md:flex-row justify-between">
                <Card className="w-full md:w-5/12 mb-4 md:mb-0 md:mr-5">
                    <CardHeader>
                        <CardTitle>{AppNames.INSTAGRAM_CAPTIONS_GENERATOR} </CardTitle>
                        <CardDescription>
                            {AppConstants.Apps.find(item => item.title == AppNames.INSTAGRAM_CAPTIONS_GENERATOR)?.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                                <FormField
                                    control={form.control}
                                    name="s3Key"
                                    render={({ field: { onChange, value, ref } }) => (
                                        <FormItem>
                                            <StorageManager
                                                acceptedFileTypes={['image/*']}
                                                path="temp-files/"
                                                maxFileCount={1}
                                                ref={storageManagerRef}
                                                processFile={processFile}
                                                maxFileSize={3 * 1048576} // Limit it to 3 MB, since claude model does not allow more than 3.75 MB for the image
                                                displayText={{
                                                    dropFilesText: 'Drop your image here or',
                                                }}
                                                onUploadSuccess={(file: any) => {
                                                    onChange(file.key);
                                                    setTimeout(() => {
                                                        storageManagerRef.current?.clearFiles();
                                                    }, 1000);
                                                }}
                                                onUploadError={(error: string, file: any) => {
                                                    notificationService.error(error);
                                                }}
                                            />
                                            {form.getValues('s3Key') &&
                                                <FormDescription>
                                                    ✅ File uploaded successfully!
                                                </FormDescription>
                                            }
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="context"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Add little context about image...(optional)" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="includeEmojis"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Include emojis
                                                </FormLabel>
                                                <FormDescription>
                                                    Add emojis to captions
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="captionCount"
                                    render={({ field }) => (
                                        <FormItem>
                                            {/* <FormLabel>Email</FormLabel> */}
                                            <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a verified email to display" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {[...Array(10)].map((_, i) => (
                                                        <SelectItem key={i} value={(i + 1).toString()}>{i + 1}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Number of captions to generate
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-between">
                                    <Button variant="outline" asChild>
                                        <Link href="/">
                                            <ArrowLeftCircle className="h-4 w-4 me-2"></ArrowLeftCircle>
                                            Back to Apps</Link>
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait
                                        </> : <>Submit</>}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                <Card className="w-full md:w-7/12">
                    <CardHeader>
                        <CardTitle>Result</CardTitle>
                        <CardDescription>
                            {form.getValues('s3Key') &&
                                <StorageImage alt={form.getValues('s3Key')} path={form.getValues('s3Key')} maxHeight="200px" maxWidth="100%" />
                            }
                            <div className="content" dangerouslySetInnerHTML={{ __html: apiResponse }}></div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                    </CardContent>
                </Card>
            </div>
        </>
    );
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
