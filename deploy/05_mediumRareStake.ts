import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';


const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const deadCoin = await hre.deployments.get('DeadCoin');

    await deploy('MediumRareStake', {
        from: deployer,
        args: [deadCoin.address],
        log: true,
    });
};
export default func;
func.tags = ['MediumRareStake'];

