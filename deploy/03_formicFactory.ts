import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;

    const { deployer, user } = await getNamedAccounts();
    const proxyRegistry = await deployments.get('ProxyRegistry');
    const formic = await deployments.get('Formic');
    const formicContract = await ethers.getContract("Formic");

    await deploy('FormicFactory', {
        from: deployer,
        log: true,
        args: [proxyRegistry.address, formic.address]
    });

    const formicFactory = await deployments.get('FormicFactory');
    formicContract.functions.transferOwnership(formicFactory.address);
};

export default func;

func.dependencies = ['Formic', 'ProxyRegistry'];
func.tags = ['FormicFactory'];