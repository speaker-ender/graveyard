import * as React from "react"
import { useContracts } from "../../hooks/contracts/contracts.hooks";
import ContractComponent from "./contractComponent";
import { useActiveConnectorContext } from "hooks/connector.hooks";
import { Header3 } from "global/typography";


interface IContractFactory {
}

const ContractFactory: React.FC<IContractFactory> = (props) => {
    const activeConnectorHooks = useActiveConnectorContext();
    const contracts = activeConnectorHooks && useContracts({ hooks: activeConnectorHooks });

    return (
        <>
            {Object.entries(contracts).length > 0 ? Object.entries(contracts).map(([key, value], index) =>
                <ContractComponent hooks={activeConnectorHooks} contract={value} contractName={key} key={index} />
            ) : <Header3>No Contracts Available For This Chain</Header3>
            }
        </>
    )
}

export default ContractFactory
