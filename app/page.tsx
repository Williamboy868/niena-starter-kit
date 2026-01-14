import Link from "next/link"
import { ArrowRight, CheckCircle2, Shield } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black selection:bg-zinc-200 dark:selection:bg-zinc-800">
      <main className="flex flex-col items-center justify-center grow px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl space-y-8 text-center">
          <div className="animate-fade-in-up">
            <span className="px-3 py-1 text-xs font-medium tracking-wider text-zinc-500 uppercase bg-zinc-100 rounded-full dark:bg-zinc-900 dark:text-zinc-400">
              Nienalabs Starter Kit
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl md:text-6xl">
            Build your next big thing
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-zinc-500 to-zinc-900 dark:from-zinc-400 dark:to-white">
              with speed and precision.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-300">
            Welcome to the Nienalabs Starter Kit. A premium, minimalistic
            foundation for your Next.js projects. Authentication, UI, and
            Database are pre-configured.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 mt-8">
            <div className="p-4 text-sm text-center border rounded-lg bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Get Started:
              </p>
              <code className="block mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                Check the README.md file for setup instructions.
              </code>
            </div>
          </div>

          <div className="w-full max-w-5xl mt-16 text-left">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Authentication Screens
              </h2>
              <Badge variant="outline" className="text-zinc-500 border-zinc-200 dark:border-zinc-800 dark:text-zinc-400">
                <Shield className="w-3 h-3 mr-1" />
                Pre-configured
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               <Link href="/auth/sign-in" className="group">
                  <Card className="h-full transition-all duration-200 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md bg-transparent">
                    <CardHeader className="p-5" >
                      <div className="flex items-start justify-between">
                         <CardTitle className="text-base font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          Sign In
                        </CardTitle>
                        <ArrowRight className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </div>
                      <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        /auth/sign-in
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/auth/sign-up" className="group">
                  <Card className="h-full transition-all duration-200 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md bg-transparent">
                    <CardHeader className="p-5" >
                       <div className="flex items-start justify-between">
                         <CardTitle className="text-base font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          Sign Up
                        </CardTitle>
                        <ArrowRight className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </div>
                      <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        /auth/sign-up
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/auth/forget-password" className="group">
                  <Card className="h-full transition-all duration-200 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md bg-transparent">
                    <CardHeader className="p-5" >
                       <div className="flex items-start justify-between">
                         <CardTitle className="text-base font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          Forgot Password
                        </CardTitle>
                        <ArrowRight className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </div>
                      <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        /auth/forget-password
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                 <Link href="/account/settings" className="group">
                  <Card className="h-full transition-all duration-200 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md bg-transparent">
                    <CardHeader className="p-5" >
                       <div className="flex items-start justify-between">
                         <CardTitle className="text-base font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          Account Settings
                        </CardTitle>
                        <ArrowRight className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </div>
                      <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                         /account/settings
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <div className="md:col-span-2 lg:col-span-2">
                   <Card className="h-full border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <CardHeader className="p-5 flex flex-row items-center justify-between" >
                      <div>
                         <CardTitle className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                          And many more...
                        </CardTitle>
                        <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          Magic Link, Two Factor, OTP, and others might require additional configuration,visit better-auth docs
                        </CardDescription>
                      </div>
                       <Badge variant="secondary" className="text-zinc-500">
                        Explorer
                      </Badge>
                    </CardHeader>
                  </Card>
                </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Powered by Better Auth, Prisma, & Shadcn UI.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
