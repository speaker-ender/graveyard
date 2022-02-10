import * as React from "react"
import { useDeadCoinContract } from "../../hooks/contracts/deadCoin.hooks";
import { Web3ReactHooks } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { ContractDetails } from "./parts/details";
import { FunctionFactory } from "./parts/functionFactory";
import { useContracts } from "../../hooks/contracts/contracts.hooks";
import ContractComponent, { IContract } from "./contractComponent";
import { Contract } from "@ethersproject/contracts";


const ContractFactory: React.FC<{ hooks: Web3ReactHooks }> = (props) => {
    const contracts = useContracts({ hooks: props.hooks });

    return (

        <div>
            {Object.entries(contracts).map(([key, value]) => {

                return (
                    <ContractComponent hooks={props.hooks} contract={value} contractName={key} />
                )
            })}
        </div>
    )
}

export default ContractFactory
