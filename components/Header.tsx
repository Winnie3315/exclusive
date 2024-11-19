import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import React from 'react';

const Header = async () => {
    const { userId } = await auth();
    return (
        <header className="border-b border-gray-200">
            <div className="wrap flex items-center justify-between px-6 py-4">
                <div className="text-xl font-bold">Exclusive</div>
                <nav className="flex space-x-6">
                    <Link href="/" className="text-gray-800 hover:text-gray-600">Home</Link>
                    <Link href="/contact" className="text-gray-800 hover:text-gray-600">Contact</Link>
                    <Link href="/about-us" className="text-gray-800 hover:text-gray-600">About</Link>
                    {!userId ? (
                        <Link href="/sign-up" className="text-gray-800 hover:text-gray-600">Sign Up</Link>
                    ) : (
                        <Link href="/profile" className="text-gray-800 hover:text-gray-600">Profile</Link>
                    )}

                </nav>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="What are you looking for?"
                            className="px-4 py-2 text-sm text-gray-800 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600">
                            <img src="/icons/search.svg" alt="search logo" />
                        </button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 text-red-500"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 8.5a5.5 5.5 0 00-9.194-4.116 5.5 5.5 0 00-7.612 8.112l8.3 8.302a1.5 1.5 0 002.116 0l8.3-8.302A5.5 5.5 0 0021 8.5z"
                                />
                            </svg>
                            <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                                4
                            </span>
                        </div>

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 3h1.8c.966 0 1.71.786 1.91 1.732L7.875 9m0 0h11.27a2.25 2.25 0 012.088 1.404l3.787 9.456M7.875 9l-.816 4.082M7.875 9l-4.525 9.946a1.5 1.5 0 001.316 2.054h15.76M9 19.5h2.25M15 19.5h2.25"
                            />
                        </svg>

                        <div className="profile">
                            <SignedOut>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 20.25v-1.5a3 3 0 00-3-3h-1.5a3 3 0 00-3 3v1.5m3-14.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z"
                                    />
                                </svg>
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;