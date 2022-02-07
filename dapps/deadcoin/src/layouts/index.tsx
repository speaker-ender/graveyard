import * as React from "react"
import { Link } from "gatsby"
import loadable from '@loadable/component'
// import MetaMaskComponent from "../components/metaMaskComponent";
const MetaMaskComponent = loadable(() => import('../components/MetaMaskComponent'));
const MetaMask = loadable(() => import('../components/metamask'));

// markup
const Layout = (props) => {
    return (
        <main>
            <h1>DeadCoin</h1>
            {/* <MetaMask /> */}
            <MetaMaskComponent />
            {props.children}
        </main>
    )
}

export default Layout
