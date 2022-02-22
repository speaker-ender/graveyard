import * as React from "react";
import Head from 'next/head';
// import Navigation from "components/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "../components/header";
import { FC } from "react";
import Navigation from "components/navigation";
import { StyledPage } from "pages/page.styles";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme.styles";
import { GlobalStyle } from "./global.styles";

const ActiveConnectorContextProvider = dynamic<{}>(() => import('hooks/connector.hooks').then((mod) => mod.ActiveConnectorContextProvider), { ssr: false });

const Layout: React.FC = ({ children }) => {
    const [navOpen, setNavOpen] = useState(false);


    const updateNavOpen = React.useCallback((newNavState?: boolean) => {
        console.log('trying to change nav state');
        setNavOpen(newNavState || !navOpen);
    }, [navOpen, setNavOpen]);

    return (
        <ThemeProvider theme={theme}>
            <ActiveConnectorContextProvider>
                <div className="container">
                    <GlobalStyle />
                    <Head>
                        <title>Dead D3X</title>
                        <link rel="icon" href="/favicon.ico" />
                    </Head>
                    <main>
                        <Header updateNavOpen={updateNavOpen} />
                        <Navigation open={true} updateNavOpen={updateNavOpen} />
                        <StyledPage>
                            {children}
                        </StyledPage>
                    </main>
                </div>
            </ActiveConnectorContextProvider>
        </ThemeProvider>
    )
}

export default Layout;