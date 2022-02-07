import * as React from "react"
import { hooks, metaMask } from '../connectors/metaMask';
import { MetaMaskWallet } from "./wallet/metamask/metamaskWallet";
import { Status } from "./wallet/status";
import { ChainId } from "./wallet/chainId";
import { Accounts } from "./wallet/accounts";
import Contracts from "./contracts";

const MetaMaskComponent = () => {
    return (
        <div>
            <h2>Web3 React Connections</h2>
            <Status connector={metaMask} hooks={hooks} />
            <ChainId hooks={hooks} />
            <Accounts hooks={hooks} />
            <MetaMaskWallet connector={metaMask} hooks={hooks} />
            <Contracts hooks={hooks} />
        </div>
    )
}

export default MetaMaskComponent
