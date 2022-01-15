import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;

    const { deployer, user } = await getNamedAccounts();

    await deploy('ProxyRegistry', {
        from: deployer,
        log: true,
        contract: 'contracts/skeletons/opensea/ERC721Tradable.sol:ProxyRegistry'
    });
};

export default func;

func.tags = ['ProxyRegistry'];