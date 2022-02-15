import * as React from "react"
import { useContracts } from "../../hooks/contracts/contracts.hooks";
import ContractComponent from "./contractComponent";
import { StyledContract } from "./contractComponent.styles";
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
                    <ContractComponent hooks={activeConnectorHooks} contract={value} contractName={key} key={index} />
                )
            })}
        </div>
    )
}

export default ContractFactory
