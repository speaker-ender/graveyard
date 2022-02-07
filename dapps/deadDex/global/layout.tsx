import * as React from "react";
import Head from 'next/head';
// import Header from "components/header";
// import Navigation from "components/navigation";
import { useState } from "react";
// import { StyledPageContainer } from "./layout.styles";
import dynamic from "next/dynamic";

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
                    @font-face {
                        font-family: "PlayBold";
                        src: url("fonts/Play-Bold.ttf") format('truetype');
                        font-style: bold;
                        font-weight: 500;
                      }
                      @font-face {
                        font-family: "Play";
                        src: url("fonts/Play-Regular.ttf") format('truetype');
                        font-style: normal;
                        font-weight: 400;
                      }
                    body {
                        // height: 100vh;
                        margin: 0;
                        // overflow: hidden;
                    }`}
            </style>
            <Head>
                <title>3NDER</title>
                <link rel="icon" href="/favicon.ico" />
                <link
                    rel="preload"
                    href="fonts/Play-Bold.ttf"
                    as="font"
                    type="font/ttf"
                    crossOrigin=""
                />
                <link
                    rel="preload"
                    href="fonts/Play-Regular.ttf"
                    as="font"
                    type="font/ttf"
                    crossOrigin=""
                />
            </Head>
            <main>
                {/* <Header updateNavOpen={updateNavOpen} /> */}
                {/* <Navigation open={navOpen} updateNavOpen={updateNavOpen} /> */}
                {/* <StyledPageContainer entered={!!entered}> */}
                {children}
                {/* </StyledPageContainer> */}
            </main>
        </div>
    )
}

export default Layout;