export const networkAliasToName = (alias: string) => {
    switch (alias) {
        case 'homestead':
            return 'Ethereum'
        case 'ropsten':
            return 'Ethereum Ropsten Testnet'
        case 'maticmum':
            return 'Matic Testnet'
        default:
            return 'Not Connected'
    }
}