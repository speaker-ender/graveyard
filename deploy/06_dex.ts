import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';


const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const deadCoin = await deployments.get('DeadCoin');
    const mediumRareStake = await deployments.get('MediumRareStake');

    await deploy('DEX', {
        from: deployer,
        args: [deadCoin.address, mediumRareStake.address],
        log: true,
    });
};

export default func;

func.dependencies = ['DeadCoin', 'MediumRareStake'];
func.tags = ['DEX'];
