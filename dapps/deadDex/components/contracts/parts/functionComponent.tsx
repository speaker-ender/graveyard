import * as React from "react"
import { ChangeEvent, FC, useCallback, useState } from "react";
import { Header5, Paragraph } from "../../../global/typography";
import { FunctionFragment } from "ethers/lib/utils";
import { InputFactory } from "./inputFactory";
import { StyledButton } from "../../../global/button.styles";
import { StyledFunction } from "./functionFactory.styles";
import { Contract } from "@ethersproject/contracts";
import { removeParenthesisWithText } from "../../../helpers/text.helpers";
import { PAYABLE_NAME } from "./inputs/ethInput";
import { ethers } from "ethers";

interface IContractDetails {
    contract: Contract;
    name: string;
    fragment: FunctionFragment;
};

interface IFunctionState {
    [inputName: string]: string | number | boolean;
}

export const FunctionComponent: FC<IContractDetails> = (props) => {
    const [functionState, setFunctionState] = useState<IFunctionState>(null!);
    const [payableState, setPayableState] = useState<string>(null!);
    const [resultState, setResultState] = useState<IFunctionState>(null!);


    const trySubmit = useCallback(async (event: React.FormEvent, functionName: string) => {
        event.preventDefault();
        const passedProps = functionState ? Object.entries(functionState).map(([key, input]) => input) : [];

        const contractFunction = props.contract[functionName];

        if (!!passedProps) {
            const receipt = await (!!payableState ? contractFunction(...passedProps, { value: ethers.utils.parseEther(payableState) }) : contractFunction(...passedProps));

            handleFunctionResult(receipt);
        } else {
            const receipt = await contractFunction(!!payableState && { value: ethers.utils.parseEther(payableState) });

            handleFunctionResult(receipt);
        }
    }, [props.contract, functionState]);

    const handleFunctionResult = useCallback((result: IFunctionState) => {
        setResultState(result);

        console.log(result);
    }, [resultState, setResultState]);

    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        console.log(functionState)

        target.name === PAYABLE_NAME ? setPayableState(value as string) : setFunctionState({ ...functionState, [name]: value });
    }, [functionState, setFunctionState]);

    return (
        <StyledFunction>
            <form onSubmit={(e) => trySubmit(e, removeParenthesisWithText(props.name))}>
                <Header5>{removeParenthesisWithText(props.name)}</Header5>
                <Paragraph>{props.fragment.gas}</Paragraph>
                <InputFactory inputs={props.fragment.inputs} payable={props.fragment.payable} handleInputChange={handleInputChange} />
                <StyledButton type='submit'>Submit</StyledButton>
                <Paragraph>{resultState && resultState.toString()}</Paragraph>
            </form>
        </StyledFunction>
    )
}