import { AppConstants } from "@/utils/AppConstants";
import { LayoutGridIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-grow bg-gray-100 px-6 sm:px-16 py-8">

      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-800 my-8">AI Tools!</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4">
          {
            AppConstants.Apps.map((app, index) => (

              <Link href={app.path}>
                <div key={index} className="flex items-center bg-white shadow-md rounded-lg p-4">
                  <div className="mr-4">
                    <LayoutGridIcon className="h-10 w-10 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-purple-800 hover:text-purple-600">{app.title}</h3>
                    <p className="text-gray-600 text-sm">{app.description}</p>
                  </div>
                </div>
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  );
}
