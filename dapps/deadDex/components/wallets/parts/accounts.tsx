import * as React from "react"
import { Web3ReactHooks } from "@web3-react/core"
import { BigNumber } from "ethers"
import { formatEther } from "ethers/lib/utils"
import { useEffect, useState } from "react"
import { StyledAccounts } from "./accounts.styles"

const useBalances = (
    provider?: ReturnType<Web3ReactHooks['useProvider']>,
    accounts?: string[]
): BigNumber[] | undefined => {
    const [balances, setBalances] = useState<BigNumber[] | undefined>()

    useEffect(() => {
        if (provider && accounts?.length) {
            let stale = false

            void Promise.all(accounts.map((account) => provider.getBalance(account))).then((balances) => {
                if (!stale) {
                    setBalances(balances)
                }
            })

            return () => {
                stale = true
                setBalances(undefined)
            }
        }
    }, [provider, accounts])

    return balances
}

export const Accounts = ({ hooks: { useAccounts, useProvider, useENSNames } }: { hooks: Web3ReactHooks }) => {
    const provider = useProvider()
    const accounts = useAccounts()
    const ENSNames = useENSNames(provider)

    const balances = useBalances(provider, accounts)

    return (
        <StyledAccounts>
            Accounts:
            {accounts === undefined
                ? ' -'
                : accounts.length === 0
                    ? ' None'
                    : accounts?.map((account, i) => (
                        <ul key={account} style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <b>{ENSNames?.[i] ?? account}</b>
                            {balances?.[i] ? ` (Ξ${formatEther(balances[i])})` : null}
                        </ul>
                    ))}
        </StyledAccounts>
    )
}