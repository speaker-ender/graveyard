import * as React from "react"
import { Contract } from "@ethersproject/contracts";
import { FC } from "react";
import { Header3, Header5 } from "../../../global/typography";

interface IContractDetails extends Pick<Contract, "address" | "contractName"> {
    showLockedEthValue?: boolean;
};

export const ContractDetails: FC<IContractDetails> = (props) => {
    const nameFormat = (name: string) => {
        console.log(name);
        return name.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })
    }

    return <div>
        <Header3>{nameFormat(props.contractName)}</Header3>
        <Header5>{`Address: ${props.address}`}</Header5>
    </div>
}