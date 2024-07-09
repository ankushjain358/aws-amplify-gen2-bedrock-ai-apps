"use client"

import { Schema } from "@/amplify/data/resource";
import { Authenticator, Input } from "@aws-amplify/ui-react"
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from "aws-amplify/api";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppConstants, AppNames } from "@/utils/AppConstants";
import Link from "next/link";
import { ArrowLeftCircle, Disc3Icon, Loader2 } from "lucide-react";
import notificationService from "@/utils/NotificationService";
import commonService from "@/utils/CommonService";
import React from "react";
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
import { Textarea } from "@/components/ui/textarea";


function TextRephraserComponent() {

    const client = generateClient<Schema>()
    const [apiResponse, setApiResponse] = React.useState<string>("");

    // 1. Define  schema.
    const formSchema = z.object({
        text: z.string()
            .trim()
            .min(1, "Please enter text")
            .min(20, "Please enter a longer text with minimum 20 characters")
            .max(1000, "Please enter a shorter text with maximum 1000 characters"),
        context: z.string().max(50, {
            message: "Context must be at less than 50 characters.",
        }),
    });

    // 2. Create from from the schema
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: "",
            context: ""
        },
    });
    const { formState: { isSubmitting } } = form;

    // 3. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        // reset response
        setApiResponse("");

        const { data, errors } = await client.queries.rephraseText({
            text: values.text,
            context: values.context
        });

        if (errors?.length! > 0) {
            notificationService.errors(errors!.map(error => error.message));
            return;
        }

        setApiResponse(data?.content!);
    }

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between">
                <Card className="w-full md:w-5/12 mb-4 md:mb-0 md:mr-5">
                    <CardHeader>
                        <CardTitle>{AppNames.TEXT_REPHRASER} </CardTitle>
                        <CardDescription>
                            {AppConstants.Apps.find(item => item.title == AppNames.TEXT_REPHRASER)?.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                                <FormField
                                    control={form.control}
                                    name="text"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea placeholder='To rewrite text, enter or paste it here and press "Submit"' {...field} rows={15} ></Textarea>
                                            </FormControl>
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
                                                <Input placeholder="Add little context about the text...(optional)" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            <FormDescription>
                                                This context will help the model to understand the context of the text.
                                            </FormDescription>
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
                            The rephrased text will appear here
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isSubmitting &&
                            <div className="flex justify-center mt-10">
                                <Disc3Icon className="mr-2 h-10 w-10 animate-spin" />
                            </div>
                        }

                        <div dangerouslySetInnerHTML={{ __html: apiResponse }}></div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
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
