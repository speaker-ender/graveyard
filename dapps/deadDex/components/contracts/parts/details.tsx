import * as React from "react"
import { Contract } from "@ethersproject/contracts";
import { FC, useCallback, useState, useEffect } from "react";
import { Header3, Header5 } from "../../../global/typography";
import { camelCaseToUpperCase } from "../../../helpers/text.helpers";

interface IContractDetails extends Pick<Contract, "address" | "contractName" | "signer" | "provider"> {
    showLockedEthValue?: boolean;
};

export const ContractDetails: FC<IContractDetails> = (props) => {
    const [signerAddress, setSignerAddress] = useState('');
    const [network, setNetwork] = useState('');


    const getDetails = useCallback(async () => {
        setSignerAddress(await props.signer.getAddress());
        setNetwork((await props.provider.getNetwork()).name);
    }, [props.signer, props.provider, setSignerAddress, setNetwork]);

    useEffect(() => {
        getDetails();
        return () => {
        }
    }, [])

    return <div>
        <Header5>{`Address: ${props.address}`}</Header5>
        <Header5>{`Connected Signer: ${signerAddress}`}</Header5>
        <Header5>{`Connected Provider: ${network}`}</Header5>
    </div>
}