import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';


const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const deadCoin = await deployments.get('DeadCoin');

    await deploy('DEX', {
        from: deployer,
        args: [deadCoin.address],
        log: true,
    });
};
export default func;
func.dependencies = ['DeadCoin'];
func.tags = ['DEX'];

const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
