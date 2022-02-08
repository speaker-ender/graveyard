import * as React from "react";
import Head from 'next/head';
// import Navigation from "components/navigation";
import { useState } from "react";
// import { StyledPageContainer } from "./layout.styles";
import dynamic from "next/dynamic";
import Header from "../components/header";

const Layout: React.FC = ({ children }) => {
    const [navOpen, setNavOpen] = useState(false);


    const updateNavOpen = React.useCallback((newNavState?: boolean) => {
        console.log('trying to change nav state');
        setNavOpen(newNavState || !navOpen);
    }, [navOpen, setNavOpen]);

    return (
        <div className="container">
            <style jsx global>
                {`
                    body {
                        margin: 0;
                    }`}
            </style>
            <Head>
                <title>Dead D3X</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Header updateNavOpen={updateNavOpen} />
                {/* <Navigation open={navOpen} updateNavOpen={updateNavOpen} /> */}
                {/* <StyledPageContainer entered={!!entered}> */}
                {children}
                {/* </StyledPageContainer> */}
            </main>
        </div>
    )
}

export default Layout;