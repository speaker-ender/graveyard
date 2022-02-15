import * as React from "react"
import { useState } from "react";
import { ContractDetails } from "./parts/details";
import { FunctionFactory } from "./parts/functionFactory";
import { useContract } from "../../hooks/contract.hooks";
import { Deployment } from "hardhat-deploy/types";
import { StyledContract, StyledContractContent } from "./contractComponent.styles";
import { Web3ReactActiveHooks } from "hooks/connector.hooks";
import { useGeneratedColorTheme } from "hooks/theme.hooks";
import { useEffect } from "react";
import Drawer from "components/drawer";

export interface IContract {
    hooks: Web3ReactActiveHooks;
    contract: Deployment;
    contractName: string;
}

const ContractComponent: React.FC<IContract> = (props) => {
    const currentProvider = props.hooks.useActiveProvider();
    const { library, account } = props.hooks.useActiveWeb3React(currentProvider);
    const contract = useContract(props.contract.address, props.contract.abi, library, account);

    const { backgroundColor, textColor, updateBackgroundColor } = useGeneratedColorTheme();

    useEffect(() => {
        !!contract && updateBackgroundColor(contract.address);
        return () => {
        }
    }, [contract, updateBackgroundColor])

    return (
        <>
            {!!contract &&
                <StyledContract style={{ backgroundColor: backgroundColor, color: textColor }}>
                    <Drawer title={props.contractName}>
                        <StyledContractContent>
                            <ContractDetails {...props.contract} {...contract} contractName={props.contractName} showLockedEthValue={true} />
                            <FunctionFactory fragments={contract.interface.functions} contract={contract} />
                            {/* {!!balance &&
                        <p>{`Balance: ${balance.toBigInt().toLocaleString()} ${symbol}`}</p>
                    } */}
                        </StyledContractContent>
                    </Drawer>
                </StyledContract>
            }
        </>
    )
}

export default ContractComponent
