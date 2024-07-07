
"use client"

import { AppConstants } from "@/utils/AppConstants";
import { MenuIcon, SparkleIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function Header() {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="w-full flex-shrink-0 sticky top-0 z-10">
            <nav className="bg-white border-gray-200 py-3.5 dark:bg-gray-900">
                <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
                    <Link href="/" legacyBehavior>
                        <a className="flex items-center">
                            <SparkleIcon className="h-6 w-6 me-2 text-purple-700 animate-pulse" />
                            <span className="self-center text-md lg:text-xl font-semibold whitespace-nowrap dark:text-white">{AppConstants.AppName}</span>
                        </a>
                    </Link>
                    <div className="flex items-center lg:order-2">
                        <button
                            data-collapse-toggle="mobile-menu-2"
                            type="button"
                            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            aria-controls="mobile-menu-2"
                            aria-expanded={isMobileMenuOpen ? "true" : "false"}
                            onClick={handleMobileMenuToggle}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                        </button>
                    </div>
                    <div className={`items-center justify-between ${isMobileMenuOpen ? "block" : "hidden"} w-full lg:flex lg:w-auto lg:order-1`} id="mobile-menu-2">
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            {AppConstants.TopLevelMenuItems.map((item) => (
                                <li key={item.title}>
                                    <Link href={item.path} legacyBehavior>
                                        <a className={`block py-2 pl-3 pr-4 ${pathname === item.path ? "text-purple-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700`}>
                                            {item.title}
                                        </a>
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="py-2 pl-3 pr-4 lg:p-0 ">Apps</DropdownMenuTrigger>
                                    <DropdownMenuContent align="center" className="mt-1.5 pl-3">
                                        <DropdownMenuLabel>AI tools and services</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {AppConstants.Apps.map((item) => (
                                            <DropdownMenuItem>
                                                <Link href={item.path} legacyBehavior>
                                                    <a className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
                                                        <b className="text-sm font-semibold leading-6">{item.title}</b>
                                                        <br />
                                                        {item.description}
                                                    </a>
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}