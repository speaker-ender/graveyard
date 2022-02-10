import * as React from "react"
import { ChangeEvent, FC } from "react";
import { StyledLabel } from "../../../../global/typography";
import { ParamType } from "ethers/lib/utils";
import { StyledInput } from "../../../../global/input.styles";
import { StyledInputWrapper } from "../inputWrapper.styles";
import { camelCaseToUpperCase } from "../../../../helpers/text.helpers";

interface IAddressInput {
    label: string,
    name: string,
    type: string,
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const AddressInput: FC<IAddressInput> = (props) => {

    return (
        <StyledInputWrapper>
            <StyledLabel>{props.name}</StyledLabel>
            <StyledInput name={props.name || props.type} type={'text'} placeholder={props.label} onChange={(e) => props.handleInputChange(e)} />
        </StyledInputWrapper>
    )
}