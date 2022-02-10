import * as React from "react"
import { ChangeEvent, FC } from "react";
import { StyledLabel } from "../../../../global/typography";
import { StyledInput } from "../../../../global/input.styles";
import { StyledInputWrapper } from "../inputWrapper.styles";

export const PAYABLE_NAME = 'payableValue';

interface IETHInput {
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const ETHInput: FC<IETHInput> = (props) => {

    return (
        <StyledInputWrapper>
            <StyledLabel>{"Eth To Send"}</StyledLabel>
            <StyledInput name={PAYABLE_NAME} type={'text'} placeholder={"Eth To Send"} onChange={(e) => props.handleInputChange(e)} />
        </StyledInputWrapper>
    )
}