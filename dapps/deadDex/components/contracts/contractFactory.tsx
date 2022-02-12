import * as React from "react"
import { Web3ReactHooks } from "@web3-react/core";
import { useContracts } from "../../hooks/contracts/contracts.hooks";
import ContractComponent from "./contractComponent";
import { StyledContract } from "./contractComponent.styles";
import { StyledSelect } from "global/input.styles";
import { useCallback, useState } from "react";


interface IContractFactory {
    hooks: Web3ReactHooks;
    accountColor: string;
}

const ContractFactory: React.FC<IContractFactory> = (props) => {
    const contracts = useContracts({ hooks: props.hooks });
    const [currentContractName, setCurrentContractName] = useState<string>(null!);


    const switchContract = useCallback(
        async (contractName: string) => {
            setCurrentContractName(contractName)
            // if we're already connected to the desired chain, return
        },
        [currentContractName, setCurrentContractName]
    )

    return (

        <div>
            {/* <StyledSelect onChange={(e) => switchContract(e.target.value)} value={1}>
                <option value={-1}>Default Contract</option>
                {!!contracts && Object.entries(contracts).map(([key, value], index) => (
                    <option value={key} key={index}>
                        {key}
                    </option>
                ))}
            </StyledSelect> */}
            {!!contracts && Object.entries(contracts).map(([key, value], index) => {

                return (
                    <StyledContract style={{ 'backgroundColor': props.accountColor }} key={index}>
                        <ContractComponent hooks={props.hooks} contract={value} contractName={key} />
                    </StyledContract>
                )
            })}
        </div>
    )
}

export default ContractFactory
