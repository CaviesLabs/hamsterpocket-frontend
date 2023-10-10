/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export declare namespace Params {
  export type UpdatePocketDepositParamsStruct = {
    actor: AddressLike;
    id: string;
    amount: BigNumberish;
    tokenAddress: AddressLike;
  };

  export type UpdatePocketDepositParamsStructOutput = [
    actor: string,
    id: string,
    amount: bigint,
    tokenAddress: string
  ] & { actor: string; id: string; amount: bigint; tokenAddress: string };

  export type UpdatePocketWithdrawalParamsStruct = {
    actor: AddressLike;
    id: string;
  };

  export type UpdatePocketWithdrawalParamsStructOutput = [
    actor: string,
    id: string
  ] & { actor: string; id: string };
}

export interface PocketVaultInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "closePosition"
      | "deposit"
      | "etherman"
      | "getCurrentQuote"
      | "getCurrentQuoteV2"
      | "getCurrentQuoteV3"
      | "initEtherman"
      | "initialize"
      | "makeDCASwap"
      | "owner"
      | "pause"
      | "paused"
      | "permit2"
      | "quoterMapping"
      | "registry"
      | "renounceOwnership"
      | "setEtherman"
      | "setPermit2"
      | "setQuoter"
      | "setRegistry"
      | "transferOwnership"
      | "unpause"
      | "withdraw"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "ClosedPosition"
      | "Deposited"
      | "EthermanUpdated"
      | "Initialized"
      | "OwnershipTransferred"
      | "Paused"
      | "Permit2Updated"
      | "QuoterUpdated"
      | "RegistryUpdated"
      | "SwapFeeUpdated"
      | "Swapped"
      | "Unpaused"
      | "Withdrawn"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "closePosition",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [Params.UpdatePocketDepositParamsStruct]
  ): string;
  encodeFunctionData(functionFragment: "etherman", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getCurrentQuote",
    values: [AddressLike, AddressLike, AddressLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getCurrentQuoteV2",
    values: [AddressLike, AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getCurrentQuoteV3",
    values: [AddressLike, AddressLike, AddressLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "initEtherman",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "makeDCASwap",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(functionFragment: "permit2", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "quoterMapping",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "registry", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setEtherman",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setPermit2",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setQuoter",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setRegistry",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [Params.UpdatePocketWithdrawalParamsStruct]
  ): string;

  decodeFunctionResult(
    functionFragment: "closePosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "etherman", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getCurrentQuote",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCurrentQuoteV2",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCurrentQuoteV3",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initEtherman",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "makeDCASwap",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "permit2", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "quoterMapping",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "registry", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setEtherman",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setPermit2", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setQuoter", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}

export namespace ClosedPositionEvent {
  export type InputTuple = [
    actor: AddressLike,
    pocketId: string,
    baseTokenAddress: AddressLike,
    baseTokenAmount: BigNumberish,
    targetTokenAddress: AddressLike,
    targetTokenAmount: BigNumberish,
    timestamp: BigNumberish
  ];
  export type OutputTuple = [
    actor: string,
    pocketId: string,
    baseTokenAddress: string,
    baseTokenAmount: bigint,
    targetTokenAddress: string,
    targetTokenAmount: bigint,
    timestamp: bigint
  ];
  export interface OutputObject {
    actor: string;
    pocketId: string;
    baseTokenAddress: string;
    baseTokenAmount: bigint;
    targetTokenAddress: string;
    targetTokenAmount: bigint;
    timestamp: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DepositedEvent {
  export type InputTuple = [
    actor: AddressLike,
    pocketId: string,
    tokenAddress: AddressLike,
    amount: BigNumberish,
    timestamp: BigNumberish
  ];
  export type OutputTuple = [
    actor: string,
    pocketId: string,
    tokenAddress: string,
    amount: bigint,
    timestamp: bigint
  ];
  export interface OutputObject {
    actor: string;
    pocketId: string;
    tokenAddress: string;
    amount: bigint;
    timestamp: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace EthermanUpdatedEvent {
  export type InputTuple = [actor: AddressLike, ethermanAddress: AddressLike];
  export type OutputTuple = [actor: string, ethermanAddress: string];
  export interface OutputObject {
    actor: string;
    ethermanAddress: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace InitializedEvent {
  export type InputTuple = [version: BigNumberish];
  export type OutputTuple = [version: bigint];
  export interface OutputObject {
    version: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PausedEvent {
  export type InputTuple = [account: AddressLike];
  export type OutputTuple = [account: string];
  export interface OutputObject {
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace Permit2UpdatedEvent {
  export type InputTuple = [actor: AddressLike, permit2: AddressLike];
  export type OutputTuple = [actor: string, permit2: string];
  export interface OutputObject {
    actor: string;
    permit2: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace QuoterUpdatedEvent {
  export type InputTuple = [actor: AddressLike, quoter: AddressLike];
  export type OutputTuple = [actor: string, quoter: string];
  export interface OutputObject {
    actor: string;
    quoter: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RegistryUpdatedEvent {
  export type InputTuple = [actor: AddressLike, registry: AddressLike];
  export type OutputTuple = [actor: string, registry: string];
  export interface OutputObject {
    actor: string;
    registry: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SwapFeeUpdatedEvent {
  export type InputTuple = [actor: AddressLike, value: BigNumberish];
  export type OutputTuple = [actor: string, value: bigint];
  export interface OutputObject {
    actor: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SwappedEvent {
  export type InputTuple = [
    actor: AddressLike,
    pocketId: string,
    baseTokenAddress: AddressLike,
    baseTokenAmount: BigNumberish,
    targetTokenAddress: AddressLike,
    targetTokenAmount: BigNumberish,
    timestamp: BigNumberish
  ];
  export type OutputTuple = [
    actor: string,
    pocketId: string,
    baseTokenAddress: string,
    baseTokenAmount: bigint,
    targetTokenAddress: string,
    targetTokenAmount: bigint,
    timestamp: bigint
  ];
  export interface OutputObject {
    actor: string;
    pocketId: string;
    baseTokenAddress: string;
    baseTokenAmount: bigint;
    targetTokenAddress: string;
    targetTokenAmount: bigint;
    timestamp: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UnpausedEvent {
  export type InputTuple = [account: AddressLike];
  export type OutputTuple = [account: string];
  export interface OutputObject {
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WithdrawnEvent {
  export type InputTuple = [
    actor: AddressLike,
    pocketId: string,
    baseTokenAddress: AddressLike,
    baseTokenAmount: BigNumberish,
    targetTokenAddress: AddressLike,
    targetTokenAmount: BigNumberish,
    timestamp: BigNumberish
  ];
  export type OutputTuple = [
    actor: string,
    pocketId: string,
    baseTokenAddress: string,
    baseTokenAmount: bigint,
    targetTokenAddress: string,
    targetTokenAmount: bigint,
    timestamp: bigint
  ];
  export interface OutputObject {
    actor: string;
    pocketId: string;
    baseTokenAddress: string;
    baseTokenAmount: bigint;
    targetTokenAddress: string;
    targetTokenAmount: bigint;
    timestamp: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface PocketVault extends BaseContract {
  connect(runner?: ContractRunner | null): PocketVault;
  waitForDeployment(): Promise<this>;

  interface: PocketVaultInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  closePosition: TypedContractMethod<
    [pocketId: string, fee: BigNumberish, minimumAmountOut: BigNumberish],
    [[bigint, bigint]],
    "nonpayable"
  >;

  deposit: TypedContractMethod<
    [params: Params.UpdatePocketDepositParamsStruct],
    [void],
    "nonpayable"
  >;

  etherman: TypedContractMethod<[], [string], "view">;

  getCurrentQuote: TypedContractMethod<
    [
      baseTokenAddress: AddressLike,
      targetTokenAddress: AddressLike,
      ammRouterAddress: AddressLike,
      amountIn: BigNumberish,
      fee: BigNumberish
    ],
    [[bigint, bigint]],
    "nonpayable"
  >;

  getCurrentQuoteV2: TypedContractMethod<
    [
      baseTokenAddress: AddressLike,
      targetTokenAddress: AddressLike,
      ammRouterV2Address: AddressLike,
      amountIn: BigNumberish
    ],
    [[bigint, bigint]],
    "view"
  >;

  getCurrentQuoteV3: TypedContractMethod<
    [
      baseTokenAddress: AddressLike,
      targetTokenAddress: AddressLike,
      ammRouterV3Address: AddressLike,
      amountIn: BigNumberish,
      fee: BigNumberish
    ],
    [[bigint, bigint]],
    "nonpayable"
  >;

  initEtherman: TypedContractMethod<[_weth: AddressLike], [void], "nonpayable">;

  initialize: TypedContractMethod<[], [void], "nonpayable">;

  makeDCASwap: TypedContractMethod<
    [pocketId: string, fee: BigNumberish, minimumAmountOut: BigNumberish],
    [[bigint, bigint]],
    "nonpayable"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  pause: TypedContractMethod<[], [void], "nonpayable">;

  paused: TypedContractMethod<[], [boolean], "view">;

  permit2: TypedContractMethod<[], [string], "view">;

  quoterMapping: TypedContractMethod<[arg0: AddressLike], [string], "view">;

  registry: TypedContractMethod<[], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  setEtherman: TypedContractMethod<
    [ethermanAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  setPermit2: TypedContractMethod<
    [permit2Address: AddressLike],
    [void],
    "nonpayable"
  >;

  setQuoter: TypedContractMethod<
    [router: AddressLike, quoterAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  setRegistry: TypedContractMethod<
    [registryAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  unpause: TypedContractMethod<[], [void], "nonpayable">;

  withdraw: TypedContractMethod<
    [params: Params.UpdatePocketWithdrawalParamsStruct],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "closePosition"
  ): TypedContractMethod<
    [pocketId: string, fee: BigNumberish, minimumAmountOut: BigNumberish],
    [[bigint, bigint]],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "deposit"
  ): TypedContractMethod<
    [params: Params.UpdatePocketDepositParamsStruct],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "etherman"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getCurrentQuote"
  ): TypedContractMethod<
    [
      baseTokenAddress: AddressLike,
      targetTokenAddress: AddressLike,
      ammRouterAddress: AddressLike,
      amountIn: BigNumberish,
      fee: BigNumberish
    ],
    [[bigint, bigint]],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getCurrentQuoteV2"
  ): TypedContractMethod<
    [
      baseTokenAddress: AddressLike,
      targetTokenAddress: AddressLike,
      ammRouterV2Address: AddressLike,
      amountIn: BigNumberish
    ],
    [[bigint, bigint]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getCurrentQuoteV3"
  ): TypedContractMethod<
    [
      baseTokenAddress: AddressLike,
      targetTokenAddress: AddressLike,
      ammRouterV3Address: AddressLike,
      amountIn: BigNumberish,
      fee: BigNumberish
    ],
    [[bigint, bigint]],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "initEtherman"
  ): TypedContractMethod<[_weth: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "initialize"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "makeDCASwap"
  ): TypedContractMethod<
    [pocketId: string, fee: BigNumberish, minimumAmountOut: BigNumberish],
    [[bigint, bigint]],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "pause"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "paused"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "permit2"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "quoterMapping"
  ): TypedContractMethod<[arg0: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "registry"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setEtherman"
  ): TypedContractMethod<[ethermanAddress: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setPermit2"
  ): TypedContractMethod<[permit2Address: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setQuoter"
  ): TypedContractMethod<
    [router: AddressLike, quoterAddress: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setRegistry"
  ): TypedContractMethod<[registryAddress: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "unpause"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<
    [params: Params.UpdatePocketWithdrawalParamsStruct],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "ClosedPosition"
  ): TypedContractEvent<
    ClosedPositionEvent.InputTuple,
    ClosedPositionEvent.OutputTuple,
    ClosedPositionEvent.OutputObject
  >;
  getEvent(
    key: "Deposited"
  ): TypedContractEvent<
    DepositedEvent.InputTuple,
    DepositedEvent.OutputTuple,
    DepositedEvent.OutputObject
  >;
  getEvent(
    key: "EthermanUpdated"
  ): TypedContractEvent<
    EthermanUpdatedEvent.InputTuple,
    EthermanUpdatedEvent.OutputTuple,
    EthermanUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "Initialized"
  ): TypedContractEvent<
    InitializedEvent.InputTuple,
    InitializedEvent.OutputTuple,
    InitializedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "Paused"
  ): TypedContractEvent<
    PausedEvent.InputTuple,
    PausedEvent.OutputTuple,
    PausedEvent.OutputObject
  >;
  getEvent(
    key: "Permit2Updated"
  ): TypedContractEvent<
    Permit2UpdatedEvent.InputTuple,
    Permit2UpdatedEvent.OutputTuple,
    Permit2UpdatedEvent.OutputObject
  >;
  getEvent(
    key: "QuoterUpdated"
  ): TypedContractEvent<
    QuoterUpdatedEvent.InputTuple,
    QuoterUpdatedEvent.OutputTuple,
    QuoterUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "RegistryUpdated"
  ): TypedContractEvent<
    RegistryUpdatedEvent.InputTuple,
    RegistryUpdatedEvent.OutputTuple,
    RegistryUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "SwapFeeUpdated"
  ): TypedContractEvent<
    SwapFeeUpdatedEvent.InputTuple,
    SwapFeeUpdatedEvent.OutputTuple,
    SwapFeeUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "Swapped"
  ): TypedContractEvent<
    SwappedEvent.InputTuple,
    SwappedEvent.OutputTuple,
    SwappedEvent.OutputObject
  >;
  getEvent(
    key: "Unpaused"
  ): TypedContractEvent<
    UnpausedEvent.InputTuple,
    UnpausedEvent.OutputTuple,
    UnpausedEvent.OutputObject
  >;
  getEvent(
    key: "Withdrawn"
  ): TypedContractEvent<
    WithdrawnEvent.InputTuple,
    WithdrawnEvent.OutputTuple,
    WithdrawnEvent.OutputObject
  >;

  filters: {
    "ClosedPosition(address,string,address,uint256,address,uint256,uint256)": TypedContractEvent<
      ClosedPositionEvent.InputTuple,
      ClosedPositionEvent.OutputTuple,
      ClosedPositionEvent.OutputObject
    >;
    ClosedPosition: TypedContractEvent<
      ClosedPositionEvent.InputTuple,
      ClosedPositionEvent.OutputTuple,
      ClosedPositionEvent.OutputObject
    >;

    "Deposited(address,string,address,uint256,uint256)": TypedContractEvent<
      DepositedEvent.InputTuple,
      DepositedEvent.OutputTuple,
      DepositedEvent.OutputObject
    >;
    Deposited: TypedContractEvent<
      DepositedEvent.InputTuple,
      DepositedEvent.OutputTuple,
      DepositedEvent.OutputObject
    >;

    "EthermanUpdated(address,address)": TypedContractEvent<
      EthermanUpdatedEvent.InputTuple,
      EthermanUpdatedEvent.OutputTuple,
      EthermanUpdatedEvent.OutputObject
    >;
    EthermanUpdated: TypedContractEvent<
      EthermanUpdatedEvent.InputTuple,
      EthermanUpdatedEvent.OutputTuple,
      EthermanUpdatedEvent.OutputObject
    >;

    "Initialized(uint8)": TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;
    Initialized: TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "Paused(address)": TypedContractEvent<
      PausedEvent.InputTuple,
      PausedEvent.OutputTuple,
      PausedEvent.OutputObject
    >;
    Paused: TypedContractEvent<
      PausedEvent.InputTuple,
      PausedEvent.OutputTuple,
      PausedEvent.OutputObject
    >;

    "Permit2Updated(address,address)": TypedContractEvent<
      Permit2UpdatedEvent.InputTuple,
      Permit2UpdatedEvent.OutputTuple,
      Permit2UpdatedEvent.OutputObject
    >;
    Permit2Updated: TypedContractEvent<
      Permit2UpdatedEvent.InputTuple,
      Permit2UpdatedEvent.OutputTuple,
      Permit2UpdatedEvent.OutputObject
    >;

    "QuoterUpdated(address,address)": TypedContractEvent<
      QuoterUpdatedEvent.InputTuple,
      QuoterUpdatedEvent.OutputTuple,
      QuoterUpdatedEvent.OutputObject
    >;
    QuoterUpdated: TypedContractEvent<
      QuoterUpdatedEvent.InputTuple,
      QuoterUpdatedEvent.OutputTuple,
      QuoterUpdatedEvent.OutputObject
    >;

    "RegistryUpdated(address,address)": TypedContractEvent<
      RegistryUpdatedEvent.InputTuple,
      RegistryUpdatedEvent.OutputTuple,
      RegistryUpdatedEvent.OutputObject
    >;
    RegistryUpdated: TypedContractEvent<
      RegistryUpdatedEvent.InputTuple,
      RegistryUpdatedEvent.OutputTuple,
      RegistryUpdatedEvent.OutputObject
    >;

    "SwapFeeUpdated(address,uint256)": TypedContractEvent<
      SwapFeeUpdatedEvent.InputTuple,
      SwapFeeUpdatedEvent.OutputTuple,
      SwapFeeUpdatedEvent.OutputObject
    >;
    SwapFeeUpdated: TypedContractEvent<
      SwapFeeUpdatedEvent.InputTuple,
      SwapFeeUpdatedEvent.OutputTuple,
      SwapFeeUpdatedEvent.OutputObject
    >;

    "Swapped(address,string,address,uint256,address,uint256,uint256)": TypedContractEvent<
      SwappedEvent.InputTuple,
      SwappedEvent.OutputTuple,
      SwappedEvent.OutputObject
    >;
    Swapped: TypedContractEvent<
      SwappedEvent.InputTuple,
      SwappedEvent.OutputTuple,
      SwappedEvent.OutputObject
    >;

    "Unpaused(address)": TypedContractEvent<
      UnpausedEvent.InputTuple,
      UnpausedEvent.OutputTuple,
      UnpausedEvent.OutputObject
    >;
    Unpaused: TypedContractEvent<
      UnpausedEvent.InputTuple,
      UnpausedEvent.OutputTuple,
      UnpausedEvent.OutputObject
    >;

    "Withdrawn(address,string,address,uint256,address,uint256,uint256)": TypedContractEvent<
      WithdrawnEvent.InputTuple,
      WithdrawnEvent.OutputTuple,
      WithdrawnEvent.OutputObject
    >;
    Withdrawn: TypedContractEvent<
      WithdrawnEvent.InputTuple,
      WithdrawnEvent.OutputTuple,
      WithdrawnEvent.OutputObject
    >;
  };
}
