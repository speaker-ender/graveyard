import * as React from "react"
import { Link } from "gatsby"
import loadable from '@loadable/component'
import MetaMaskComponent from "../components/metaMaskComponent";
const MetaMask = loadable(() => import('../components/metamask'));

// markup
const Layout = (props) => {
    return (
        <main>
            <MetaMask />
            <MetaMaskComponent />
            {props.children}
        </main>
    )
}

export default Layout
