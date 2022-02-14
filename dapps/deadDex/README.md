# DEAD DEX
## Summary
This is a DAPP framework for quickly implementing wallets, contracts, and anything else web3 related.
While working with Scaffold-Eth, I liked how easy it was to implement contracts into a DAPP but thought I could write something better.
The goal is to create something more performant, easier to use, and more fully featured than Scaffold-Eth

## Stack
I'm using Next.JS as the base because it is very simple to spin up a site that allows for a mix of SSR and client side rendering.
Styled-Components is being used for styling because of how well it integrates with React.

## Features
### Auto-Contract Loading
This is still under development but the goal is to allow for multiple paths for auto-integrating contracts.

#### Options
##### For Testing, Rapid Development, or Advanced Controls
- Auto-Load every contract deployed to the selected chain
- Auto-Load every function from a contract with the appropriate fields
- Auto-creating usable forms based the function parameters

##### For Production
- Templates for individually adding contracts, functions, and forms that are strongly typed

### Multi-Wallet Functionality
The goal for this is to allow a user to connect multiple wallets and then switch between them while using contracts.
This would be potentially usefull for doing client-side testing, cross-chain transactions, or transactions that require multiple wallets for signing
