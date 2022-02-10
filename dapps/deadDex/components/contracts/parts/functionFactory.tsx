import * as React from "react"
import { FC } from "react";
import { FunctionFragment } from "ethers/lib/utils";
import { Contract } from "@ethersproject/contracts";
import { FunctionComponent } from "./functionComponent";

interface IContractDetails {
    fragments: {
        [functionName: string]: FunctionFragment;
    }
    contract: Contract;
};

export const FunctionFactory: FC<IContractDetails> = (props) => {

    return (
        <>
            {Object.entries(props.fragments).map(([key, value]) => {
                return (
                    <FunctionComponent contract={props.contract} fragment={value} name={key} key={key} />
                )
            })}
        </>
    )
}