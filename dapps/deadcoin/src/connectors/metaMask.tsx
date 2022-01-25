import * as React from "react"
import { initializeConnector, Web3ReactHooks } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { useCallback, useState } from 'react'
import { getAddChainParameters } from '../../../../chains'
import { MetaMaskSelect } from '../components/wallet/metamask/select'
import { address } from '../../../../deployments/localhost/DeadCoin.json'

export const [metaMask, hooks, store] = initializeConnector<MetaMask>((actions) => new MetaMask(actions))

export const MetaMaskConnect = ({
  connector,
  hooks: { useChainId, useIsActivating, useError, useIsActive, useProvider },
}: {
  connector: MetaMask
  hooks: Web3ReactHooks
}) => {
  const currentChainId = useChainId()
  const isActivating = useIsActivating()
  const error = useError()
  const active = useIsActive()
  const currentProvider = useProvider();

  const [desiredChainId, setDesiredChainId] = useState<number>(-1)
  const [addTokenSuccess, setAddTokenSuccess] = useState<boolean | undefined>()

  const token = {
    address: address,
    symbol: 'DEAD',
    decimals: 18,
    image: ''
  }

  const setChainId = useCallback(
    (chainId: number) => {
      setDesiredChainId(chainId)
      if (chainId !== -1 && chainId !== currentChainId) {
        return connector.activate(getAddChainParameters(chainId))
      }
    },
    [setDesiredChainId, currentChainId, connector]
  )

  const addToken = useCallback(() => {

    if (window && active && currentProvider.provider.isMetaMask && !!currentProvider.provider.request && token) {
      currentProvider.provider
        .request({
          method: 'wallet_watchAsset',
          params: {
            // @ts-ignore // need this for incorrect ethers provider type
            type: 'ERC20',
            options: {
              address: token.address,
              symbol: token.symbol,
              decimals: token.decimals,
              image: token.image,
              // image: getCurrencyLogoUrls(token),
            },
          },
        })
        .then((success) => {
          setAddTokenSuccess(success)
        })
        .catch(() => setAddTokenSuccess(false))
    } else {
      setAddTokenSuccess(false)
    }
  }, [token])

  if (error) {
    return (
      <>
        <MetaMaskSelect chainId={desiredChainId} setChainId={setChainId} />
        <br />
        <button
          onClick={() => connector.activate(desiredChainId === -1 ? undefined : getAddChainParameters(desiredChainId))}
        >
          Try Again?
        </button>
      </>
    )
  } else if (active) {
    return (
      <>
        <MetaMaskSelect chainId={desiredChainId === -1 ? -1 : currentChainId} setChainId={setChainId} />
        <br />
        <button onClick={() => addToken()} disabled={addTokenSuccess}>Add DeadCoin To Wallet</button>
      </>
    )
  } else {
    return (
      <>
        <MetaMaskSelect chainId={desiredChainId} setChainId={isActivating ? undefined : setChainId} />
        <br />
        <button
          onClick={
            isActivating
              ? undefined
              : () => connector.activate(desiredChainId === -1 ? undefined : getAddChainParameters(desiredChainId))
          }
          disabled={isActivating}
        >
          {isActivating ? 'Connecting...' : 'Connect'}
        </button>
      </>
    )
  }
}