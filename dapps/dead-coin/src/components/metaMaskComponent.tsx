import * as React from "react"
import loadable from '@loadable/component';
import { ethers } from "ethers";
import { useCallback, useEffect, useRef, useState } from "react";
import { hooks, metaMask, MetaMaskConnect } from '../connectors/metaMask';
import { Status } from "./wallet/status";
import { ChainId } from "./wallet/chainId";
import { Accounts } from "./wallet/accounts";

const MetaMaskComponent = () => {

    return (
        <div>
            <h2>Web3 React Connections</h2>
            <Status connector={metaMask} hooks={hooks} />
            <ChainId hooks={hooks} />
            <Accounts hooks={hooks} />
            <MetaMaskConnect connector={metaMask} hooks={hooks} />
        </div>
    )
}

export default MetaMaskComponent
