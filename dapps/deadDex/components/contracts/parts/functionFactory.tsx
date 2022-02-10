import * as React from "react"
import { FC, useCallback } from "react";
import { Header5, Paragraph } from "../../../global/typography";
import { FunctionFragment } from "ethers/lib/utils";
import { InputFactory } from "./inputFactory";
import { StyledButton } from "../../../global/button.styles";
import { StyledFunction } from "./functionFactory.styles";
import { Contract } from "@ethersproject/contracts";

interface IContractDetails {
    fragments: {
        [functionName: string]: FunctionFragment;
    }
    contract: Contract;
};

export const FunctionFactory: FC<IContractDetails> = (props) => {

    const trySubmit = useCallback(async (event: React.FormEvent, functionName: string) => {
        event.preventDefault();
        // const 

        // const receipt = await props.contract[functionName]({ value: ethers.utils.parseEther(amount) });
        // console.log(receipt);

    }, [props.contract]);

    return (
        <>
            {Object.entries(props.fragments).map(([key, value]) => {
                return (
                    <StyledFunction>
                        <form onSubmit={(e) => trySubmit(e, key)}>
                            <Header5>{key}</Header5>
                            <Paragraph>{value.payable}</Paragraph>
                            <InputFactory inputs={value.inputs} />
                            <StyledButton type='submit'>Submit</StyledButton>
                        </form>
                    </StyledFunction>
                )
            })}
        </>
    )
}