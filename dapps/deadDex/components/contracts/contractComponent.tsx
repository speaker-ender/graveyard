import * as React from "react"
import { Web3ReactHooks } from "@web3-react/core";
import { useState } from "react";
import { BigNumber } from "ethers";
import { ContractDetails } from "./parts/details";
import { FunctionFactory } from "./parts/functionFactory";
import { useContract } from "../../hooks/contract.hooks";
import { Deployment } from "hardhat-deploy/types";
import { StyledContractContent, StyledContractHeader } from "./contractComponent.styles";
import { useCallback } from "react";

export interface IContract {
    hooks: Web3ReactHooks;
    contract: Deployment;
    contractName: string;
}

const ContractComponent: React.FC<IContract> = (props) => {
    const currentProvider = props.hooks.useProvider();
    const { library, account } = props.hooks.useWeb3React(currentProvider);
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
