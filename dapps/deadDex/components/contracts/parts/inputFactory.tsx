import * as React from "react"
import { ChangeEvent, FC } from "react";
import { StyledLabel } from "../../../global/typography";
import { ParamType } from "ethers/lib/utils";
import { StyledInput } from "../../../global/input.styles";
import { StyledInputWrapper } from "./inputWrapper.styles";
import { camelCaseToUpperCase } from "../../../helpers/text.helpers";

interface IContractDetails {
    inputs: ParamType[];
    payable?: boolean;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const InputFactory: FC<IContractDetails> = (props) => {

    return (
        <>
            {props.inputs && Object.entries(props.inputs).map(([key, input]) => {
                const name = camelCaseToUpperCase(input.name || input.type);
                return (
                    <StyledInputWrapper key={key}>
                        <StyledLabel>{name}</StyledLabel>
                        <StyledInput name={input.name || input.type} type={'text'} placeholder={name} onChange={(e) => props.handleInputChange(e)} />
                    </StyledInputWrapper>
                )
            })}
            {props.payable &&
                <StyledInputWrapper>
                    <StyledLabel>{"Eth To Send"}</StyledLabel>
                    <StyledInput name="value" type={'text'} placeholder={"Eth To Send"} onChange={(e) => props.handleInputChange(e)} />
                </StyledInputWrapper>
            }
        </>
    )
}