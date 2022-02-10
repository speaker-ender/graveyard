import * as React from "react"
import { Web3ReactHooks } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { ContractDetails } from "./parts/details";
import { FunctionFactory } from "./parts/functionFactory";
import { Contract } from "@ethersproject/contracts";

export interface IContract {
    hooks: Web3ReactHooks;
    contract: Contract;
    contractName: string;
}

const ContractComponent: React.FC<IContract> = (props) => {
    const [balance, setBalance] = useState<BigNumber>(null!);
    const [symbol, setSymbol] = useState<string>(null!);

    return (
        <div>
            {!!props.contract &&
                <>
                    <ContractDetails {...props.contract} contractName={props.contractName} showLockedEthValue={true} />
                    <FunctionFactory fragments={props.contract.interface.functions} contract={props.contract} />
                    {!!balance &&
                        <p>{`Balance: ${balance.toBigInt().toLocaleString()} ${symbol}`}</p>
                    }
                </>
            }

        </div>
    )
}

export default ContractComponent
