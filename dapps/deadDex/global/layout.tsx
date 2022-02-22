import * as React from "react";
import Head from 'next/head';
import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "../components/header";
import Navigation from "components/navigation";
import { StyledPage } from "pages/page.styles";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme.styles";
import { GlobalStyle } from "./global.styles";
import { StyledButton } from "./button.styles";
import InvertTheme from "components/invertTheme";

const ActiveConnectorContextProvider = dynamic<{}>(() => import('hooks/connector.hooks').then((mod) => mod.ActiveConnectorContextProvider), { ssr: false });

const Layout: React.FC = ({ children }) => {
    const [navOpen, setNavOpen] = useState(false);
    const [isThemeInvert, setIsThemeInvert] = useState(false);


    const updateNavOpen = React.useCallback((newNavState?: boolean) => {
        console.log('trying to change nav state');
        setNavOpen(newNavState || !navOpen);
    }, [navOpen, setNavOpen]);

    const toggleIsThemeInvert = React.useCallback(() => {
        setIsThemeInvert(!isThemeInvert);
    }, [isThemeInvert, setIsThemeInvert]);

    return (
        <ThemeProvider theme={{ ...theme, isInvert: isThemeInvert }}>
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
                        <InvertTheme invertTheme={toggleIsThemeInvert} />
                    </main>
                </div>
            </ActiveConnectorContextProvider>
        </ThemeProvider>
    )
}

export default Layout;