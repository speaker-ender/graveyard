import * as React from "react"
import { ChangeEvent, FC } from "react";
import { StyledLabel } from "../../../global/typography";
import { ParamType } from "ethers/lib/utils";
import { StyledInput } from "../../../global/input.styles";
import { StyledInputWrapper } from "./inputWrapper.styles";
import { camelCaseToUpperCase } from "../../../helpers/text.helpers";
import { AddressInput } from "./inputs/addressInput";
import { ETHInput } from "./inputs/ethInput";

interface IContractDetails {
    inputs: ParamType[];
    payable?: boolean;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const InputFactory: FC<IContractDetails> = (props) => {

    return (
        <>
            {props.inputs && Object.entries(props.inputs).map(([key, input], index) => {
                const name = camelCaseToUpperCase(input.name || input.type);
                switch (input.type) {

                    case "address": return (<AddressInput name={input.name || input.type} label={name} type={input.type} handleInputChange={props.handleInputChange} key={index} />)

                    default: return (
                        <StyledInputWrapper key={index}>
                            <StyledLabel>{name}</StyledLabel>
                            <StyledInput name={input.name || input.type} type={'text'} placeholder={name} onChange={(e) => props.handleInputChange(e)} />
                        </StyledInputWrapper>
                    )


                }
            })}
            {props.payable &&
                <ETHInput handleInputChange={props.handleInputChange} />
            }
        </>
    )
}