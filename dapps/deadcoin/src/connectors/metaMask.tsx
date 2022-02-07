import * as React from "react"
import { initializeConnector, Web3ReactHooks } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { useCallback, useState } from 'react'
import { getAddChainParameters } from '../../../../chains'
import { address } from '../../../../deployments/localhost/DeadCoin.json'

export const [metaMask, hooks, store] = initializeConnector<MetaMask>((actions) => new MetaMask(actions))
