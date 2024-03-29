import "~/styles/globals.css";

import Link from 'next/link'
import { Montserrat } from "next/font/google";
import { cookies } from "next/headers";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { CssBaseline } from "@mui/material";

import { TRPCReactProvider } from "~/trpc/react";
import { env } from "~/env";
import { AccountMenu } from "./_components/AccountMenu";
import { CustomThemeProvider } from "./_containers/CustomThemeProvider";
import { CustomSessionProvider } from "./_containers/CustomSessionProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: env.SITE_NAME,
  description: "Witaj w Gateber - miejscu, gdzie Twoja wiedza staje się źródłem zasłużonych dochodów. Teraz masz szansę przekształcić swoją pasję, umiejętności i treści w realne zarobki. Nasza platforma oferuje innowacyjne rozwiązania dla blogerów, twórców treści oraz stron sportowych, umożliwiając im maksymalizację potencjału.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <CssBaseline />
        <body className={`font-sans ${montserrat.className}`} id="__next">
          <CustomThemeProvider>
            <CustomSessionProvider>
              <TRPCReactProvider cookies={cookies().toString()}>
                <AppRouterCacheProvider>
                  <main className="flex justify-center">
                    <div className="flex flex-1 flex-col gap-12 min-h-screen">
                      <div className="flex justify-between px-12 xl:px-24 box-border sticky top-0 z-10 bg-white">
                        <Link href="/">
                          <h1 className="bg-gradient-to-r from-secondary to-primary inline-block text-transparent bg-clip-text drop-shadow">
                            {env.SITE_NAME}
                          </h1>
                        </Link>
                        <AccountMenu />
                      </div>
                      <div className="container mx-auto flex flex-1 max-w-[1280px] box-border px-8">
                        {children}
                      </div>
                      <footer className="flex justify-center p-12 border-solid border-x-0 border-b-0 border-t-[1px] border-tertiary text-sm	text-center">
                        Copyright @ {env.SITE_NAME} {new Date().getFullYear()}. All rights reserved.
                      </footer>
                    </div>
                  </main>
                </AppRouterCacheProvider>
              </TRPCReactProvider>
            </CustomSessionProvider>
          </CustomThemeProvider>
        </body>
    </html>
  );
}
