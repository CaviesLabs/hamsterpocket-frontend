/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IERC165Upgradeable,
  IERC165UpgradeableInterface,
} from "../../../../../@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IERC165Upgradeable__factory {
  static readonly abi = _abi;
  static createInterface(): IERC165UpgradeableInterface {
    return new Interface(_abi) as IERC165UpgradeableInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IERC165Upgradeable {
    return new Contract(address, _abi, runner) as unknown as IERC165Upgradeable;
  }
}
