import * as React from "react"
import { Link } from "gatsby"
import loadable from '@loadable/component'
const MetaMask = loadable(() => import('../components/metamask'));

// markup
const Layout = (props) => {
    return (
        <main>
            <MetaMask />
            {props.children}
        </main>
    )
}

export default Layout
