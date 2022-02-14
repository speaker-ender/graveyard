import * as React from "react"
import { Web3ReactHooks } from "@web3-react/core";
import { useContracts } from "../../hooks/contracts/contracts.hooks";
import ContractComponent from "./contractComponent";
import { StyledContract } from "./contractComponent.styles";
import { useCallback, useState } from "react";
import { useActiveConnectorContext } from "hooks/connector.hooks";


interface IContractFactory {
    // accountColor: string;
}

const ContractFactory: React.FC<IContractFactory> = (props) => {
    const activeConnectorHooks = useActiveConnectorContext();
    const contracts = activeConnectorHooks && useContracts({ hooks: activeConnectorHooks });

    return (

        <div>
            {!!contracts && Object.entries(contracts).map(([key, value], index) => {

                return (
                    <StyledContract style={{ 'backgroundColor': 'white' }} key={index}>
                        <ContractComponent hooks={activeConnectorHooks} contract={value} contractName={key} />
                    </StyledContract>
                )
            })}
        </div>
    )
}

export default ContractFactory
