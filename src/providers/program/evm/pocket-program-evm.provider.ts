import { ethers } from "ethers";
import { deployFixtures } from "./fixtures";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";

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
      this.fixtures.Chef.address,
      (this.fixtures.Chef.interface as any)?.abi,
      signer
    );
  }

  public async createPocket(signer: Signer) {
    const contract = this.contract(signer);
    const tx = await contract.createPocket();
    const txReceipt = await tx.wait();
    console.log(txReceipt);
  }
}
