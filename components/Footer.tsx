
"use client";

import { AppConstants } from '@/utils/AppConstants';
import Link from "next/link";
import { SparkleIcon } from 'lucide-react';

export default function Footer() {
    return (<footer className="bg-white dark:bg-gray-800 flex-shrink-0">
        <div className="max-w-screen-xl p-4 py-6 mx-auto lg:py-8 md:p-8 lg:p-10">
            <div className="text-center">
                <Link href="/" className="flex items-center justify-center mb-5 text-2xl font-semibold text-gray-900 dark:text-white">
                    <SparkleIcon className="h-6 mr-3 sm:h-9 text-purple-700 animate-pulse" />
                    {AppConstants.AppName}
                </Link>
                <span className="block text-sm text-center text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} {AppConstants.AppName}
                </span>
            </div>
        </div>
    </footer>);
}