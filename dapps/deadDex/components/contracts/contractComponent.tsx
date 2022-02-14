import * as React from "react"
import { useState } from "react";
import { ContractDetails } from "./parts/details";
import { FunctionFactory } from "./parts/functionFactory";
import { useContract } from "../../hooks/contract.hooks";
import { Deployment } from "hardhat-deploy/types";
import { StyledContractContent, StyledContractHeader } from "./contractComponent.styles";
import { useCallback } from "react";
import { Web3ReactActiveHooks } from "hooks/connector.hooks";

export interface IContract {
    hooks: Web3ReactActiveHooks;
    contract: Deployment;
    contractName: string;
}

const ContractComponent: React.FC<IContract> = (props) => {
    const currentProvider = props.hooks.useActiveProvider();
    const { library, account } = props.hooks.useActiveWeb3React(currentProvider);
    const contract = useContract(props.contract.address, props.contract.abi, library, account);
    const [visible, setVisible] = useState(false);

    const visibilityToggle = useCallback(() => {
        setVisible(!visible);
    }, [visible, setVisible]);

    return (
        <>
            {!!contract &&
                <>
                    <StyledContractHeader onClick={() => visibilityToggle()}>{props.contractName}</StyledContractHeader>

                    <StyledContractContent visible={visible}>
                        <ContractDetails {...props.contract} {...contract} contractName={props.contractName} showLockedEthValue={true} />
                        <FunctionFactory fragments={contract.interface.functions} contract={contract} />
                        {/* {!!balance &&
                        <p>{`Balance: ${balance.toBigInt().toLocaleString()} ${symbol}`}</p>
                    } */}
                    </StyledContractContent>
                </>
            }
        </>
    )
}

export default ContractComponent
