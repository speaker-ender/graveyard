import * as React from "react"
import { Web3ReactHooks } from "@web3-react/core";
import { useState } from "react";
import { BigNumber } from "ethers";
import { ContractDetails } from "./parts/details";
import { FunctionFactory } from "./parts/functionFactory";
import { useContract } from "../../hooks/contract.hooks";
import { Deployment } from "hardhat-deploy/types";

export interface IContract {
    hooks: Web3ReactHooks;
    contract: Deployment;
    contractName: string;
}

const ContractComponent: React.FC<IContract> = (props) => {
    const [balance, setBalance] = useState<BigNumber>(null!);
    const [symbol, setSymbol] = useState<string>(null!);
    const currentProvider = props.hooks.useProvider();
    const { library } = props.hooks.useWeb3React(currentProvider);
    const contract = useContract(props.contract.address, props.contract.abi, library)

    return (
        <div>
            {!!contract &&
                <>
                    <ContractDetails {...props.contract} contractName={props.contractName} showLockedEthValue={true} />
                    <FunctionFactory fragments={contract.interface.functions} contract={contract} />
                    {!!balance &&
                        <p>{`Balance: ${balance.toBigInt().toLocaleString()} ${symbol}`}</p>
                    }
                </>
            }

        </div>
    )
}

export default ContractComponent
