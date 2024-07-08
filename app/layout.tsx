import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Amplify } from 'aws-amplify';
import outputs from "@/amplify_outputs.json";
import ConfigureAmplifyClientSide from "../components/ConfigureAmplifyClientSide ";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";

Amplify.configure(outputs);

export const metadata: Metadata = {
  title: "Amplify AI Apps",
  description: "Full-Stack AI Apps with AWS Amplify Gen2 and Amazon Bedrock",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
        <ConfigureAmplifyClientSide />
        <Toaster />
        <>
          <Header></Header>
          {children}
          <Footer></Footer>
        </>
      </body>
    </html>
  );
}
