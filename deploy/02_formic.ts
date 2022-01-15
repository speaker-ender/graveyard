import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;

    const { deployer, user } = await getNamedAccounts();
    const proxyRegistry = await deployments.get('ProxyRegistry');

    await deploy('Formic', {
        from: deployer,
        log: true,
        args: [proxyRegistry.address]
    });
};

export default func;

func.dependencies = ['ProxyRegistry']
func.tags = ['Formic'];