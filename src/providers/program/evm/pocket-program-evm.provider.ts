import { ethers, Signer } from "ethers";
import { deployFixtures } from "./fixtures";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Provider } from "@ethersproject/abstract-provider";
import { Params } from "./typechain-types/contracts/PocketChef";
import { abi } from "./artifacts/contracts/PocketChef.sol/PocketChef.json";

export class EvmPocketProgramProvider {
  private fixtures: Awaited<ReturnType<typeof deployFixtures>>;

  /**
   * @dev Initilize modules.
   */
  constructor() {
    this.init();
  }

  /**
   * @dev Initilize modules.
   */
  private async init() {
    this.fixtures = await loadFixture(deployFixtures);
    this.fixtures.Chef.address;
    this.fixtures.Chef.createPocket;
    this.fixtures.owner.address;
  }

  /**
   * @dev The function to get contract.
   */
  private contract(signer: Provider | Signer) {
    return new ethers.Contract(
      "0x73C4a0F33c4267978039120874c3f2f8f3A5AEbE",
      abi,
      signer
    );
  }

  public async createPocket(
    createdPocketDto: Params.CreatePocketParamsStruct,
    signer: Signer
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.fixtures.Chef.connect(signer).createPocketAndDepositEther(
      createdPocketDto,
      { value: ethers.constants.WeiPerEther }
    );

    // const contract = this.contract(signer);
    // const tx = await contract.createPocket(createdPocketDto);
    // const txReceipt = await tx.wait();
    // console.log(txReceipt);
  }
}
