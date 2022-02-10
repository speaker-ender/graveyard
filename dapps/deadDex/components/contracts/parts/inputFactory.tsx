import * as React from "react"
import { FC } from "react";
import { Paragraph, StyledLabel } from "../../../global/typography";
import { ParamType } from "ethers/lib/utils";
import { StyledInput } from "../../../global/input.styles";
import { StyledInputWrapper } from "./inputWrapper.styles";

interface IContractDetails {
    inputs: ParamType[];
};

export const InputFactory: FC<IContractDetails> = (props) => {

    return (
        <>
            {props.inputs && Object.entries(props.inputs).map(([key, input]) => {
                return (
                    <StyledInputWrapper>
                        <StyledLabel>{input.name}</StyledLabel>
                        <StyledInput type={'text'} placeholder={input.name} />
                    </StyledInputWrapper>
                )
            })}
        </>
    )
}