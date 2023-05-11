/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  PocketVault,
  PocketVaultInterface,
} from "../../../contracts/PocketVault.sol/PocketVault";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "pocketId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "baseTokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "baseTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "targetTokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "targetTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "ClosedPosition",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "pocketId",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "Deposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "permit2",
        type: "address",
      },
    ],
    name: "Permit2Updated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "quoter",
        type: "address",
      },
    ],
    name: "QuoterUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "registry",
        type: "address",
      },
    ],
    name: "RegistryUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "pocketId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "baseTokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "baseTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "targetTokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "targetTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "Swapped",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "pocketId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "baseTokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "baseTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "targetTokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "targetTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "Withdrawn",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "pocketId",
        type: "string",
      },
    ],
    name: "closePosition",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "actor",
            type: "address",
          },
          {
            internalType: "string",
            name: "id",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
        ],
        internalType: "struct Params.UpdatePocketDepositParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "baseTokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "targetTokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
    ],
    name: "getCurrentQuote",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "pocketId",
        type: "string",
      },
    ],
    name: "makeDCASwap",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
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
  {
    inputs: [],
    name: "permit2",
    outputs: [
      {
        internalType: "contract IPermit2",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "quoter",
    outputs: [
      {
        internalType: "contract IQuoter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "registry",
    outputs: [
      {
        internalType: "contract PocketRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "permit2Address",
        type: "address",
      },
    ],
    name: "setPermit2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "quoterAddress",
        type: "address",
      },
    ],
    name: "setQuoter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "registryAddress",
        type: "address",
      },
    ],
    name: "setRegistry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "actor",
            type: "address",
          },
          {
            internalType: "string",
            name: "id",
            type: "string",
          },
        ],
        internalType: "struct Params.UpdatePocketWithdrawalParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x608080604052346100c1576000549060ff8260081c1661006f575060ff80821610610034575b604051611f5690816100c78239f35b60ff90811916176000557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160ff8152a138610025565b62461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b6064820152608490fd5b600080fdfe60406080815260048036101561001f575b5050361561001d57600080fd5b005b600091823560e01c918263101ec30a1461151657826312261ee7146114ee5782633f4ba83a1461144e5782635c975abb1461142a57826361a45ae614610d035782636afd431a14610b38578263715018a614610adc5782637b10399914610ab45782638129fc1c146109395782638456cb59146108975782638b6a70c4146106795782638da5cb5b146106515782639c89bb3d146103c6578263a91ee0dc14610361578263c6bbd5a714610335578263d02373091461020a578263f2fde38b1461015c57505063f912c64b146100f55780610010565b34610159576020366003190112610159576001600160a01b0361011661157b565b61011e6115db565b16806001600160a01b031960cb54161760cb55337ff7248061c47e1cf157db85f3c9bac5cb0007cbb8867be0807f6dcdb7eb8f52688380a380f35b80fd5b909150346102065760203660031901126102065761017861157b565b916101816115db565b6001600160a01b0383161561019d578361019a84611633565b80f35b906020608492519162461bcd60e51b8352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152fd5b8280fd5b83346101595760603660031901126101595761022461157b565b602435906001600160a01b0390818316830361031e576102d4916044359587868151936102968561028860209a8b998a840190602b926bffffffffffffffffffffffff19809260601b16835261017760eb1b601484015260601b1660178201520190565b03601f1981018752866116c1565b60cb5416928251968795869485937fcdca175300000000000000000000000000000000000000000000000000000000855284015260448301906116e3565b8a602483015203925af192831561032a57926102f6575b508351928352820152f35b9080925081813d8311610323575b61030e81836116c1565b8101031261031e575190846102eb565b600080fd5b503d610304565b8551903d90823e3d90fd5b83823461035d578160031936011261035d576020906001600160a01b0360cb54169051908152f35b5080fd5b8334610159576020366003190112610159576001600160a01b0361038361157b565b61038b6115db565b16806001600160a01b031960c954161760c955337f482b97c53e48ffa324a976e2738053e9aff6eee04d8aac63b10e19411d869b828380a380f35b8334610159576103d536611591565b6001600160a01b0360c95416855192632483e71560e01b845260209384818881865afa80156106185785908790610622575b8951632474521560e21b81528981019182523360208301529250829081906040015b0381865afa90811561061857906104479187916105eb575b5061173b565b610456600260655414156117ac565b6002606555865163381635c960e21b815284878201526101c096878280610481602482018988611908565b0381875afa9384156105e1579089918893899a8a9761059b575b5050908291889351938492639888b5ab60e01b845283015281806104c3602482018b8a611908565b03915afa968715610590579661052d575b509561051b839261050988847fb194e0ef323d92c92731da0692fef530ee4d3105579af6ae8489773b7bfd25b497829c61198d565b9788948b519586953399429588611929565b0390a260016065558351928352820152f35b8396507fb194e0ef323d92c92731da0692fef530ee4d3105579af6ae8489773b7bfd25b49392610509899361057a61051b948d803d10610589575b61057281836116c1565b810190611d7c565b905099509350509293506104d4565b503d610568565b8951903d90823e3d90fd5b89949b5080919297506105c4939550903d106105da575b6105bc81836116c1565b81019061184e565b505050505050509991939099959091928c61049b565b503d6105b2565b89513d89823e3d90fd5b61060b9150863d8811610611575b61060381836116c1565b810190611723565b89610441565b503d6105f9565b88513d88823e3d90fd5b5081813d831161064a575b61063781836116c1565b8101031261031e57846104299151610407565b503d61062d565b83823461035d578160031936011261035d576020906001600160a01b03609754169051908152f35b909150346102065760209060031990828236011261088f5780359167ffffffffffffffff831161089357608090833603011261088f576001600160a01b03918260c954168551632483e71560e01b815285818581855afa80156108855786918991610854575b508751632474521560e21b8152858101918252336020830152928391829081906040015b03915afa801561084a5761071d91889161082d575061173b565b61072c600260655414156117ac565b600260655560648101918361074084611e9b565b1691878660448301359460648a51809481937f23b872dd00000000000000000000000000000000000000000000000000000000835233898401523060248401528960448401525af19089821561059057937f8b5e56b33d13f92f8ccbdeef17b16bf5dbbcd3a6b98f58057f8c5c6301af18d3979695936107d26107f7946107dd946107e59d9891610810575b50611dc5565b602481019101611d92565b989094611e9b565b9383519860608a5260608a0191611908565b95870152429086015216928033930390a3600160655580f35b61082791508c8d3d106106115761060381836116c1565b386107cc565b6108449150863d88116106115761060381836116c1565b38610441565b86513d89823e3d90fd5b82819392503d831161087e575b61086b81836116c1565b8101031261031e575185906107036106df565b503d610861565b87513d8a823e3d90fd5b8480fd5b8580fd5b909150346102065782600319360112610206576108b26115db565b6033549060ff82166108f6575060ff1916600117603355513381527f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25890602090a180f35b606490602084519162461bcd60e51b8352820152601060248201527f5061757361626c653a20706175736564000000000000000000000000000000006044820152fd5b90915034610206578260031936011261020657825460ff8160081c161591828093610aa7575b8015610a90575b15610a27575060ff1980821660011785556109b29183610a16575b5060ff855460081c169061099482611eaf565b61099d82611eaf565b603354166033556109ad81611eaf565b611eaf565b6109bb33611633565b8254906109d160ff8360081c166109ad81611eaf565b60016065556109de578280f35b61ff001916825551600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb384740249890602090a138808280f35b61ffff191661010117855538610981565b608490602085519162461bcd60e51b8352820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a65640000000000000000000000000000000000006064820152fd5b50303b1580156109665750600160ff831614610966565b50600160ff83161061095f565b83823461035d578160031936011261035d576020906001600160a01b0360c954169051908152f35b8334610159578060031936011261015957610af56115db565b60006001600160a01b036097546001600160a01b03198116609755167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b9091503461020657610b4936611591565b6001600160a01b0360c9959295541692845195632483e71560e01b875260209485888481845afa978815610cb3578598610cd4575b508651632474521560e21b81528381019889523360208a0152978690899081906040010381845afa978815610cb357869798610bc29187989791610cbd575061173b565b610bd1600260655414156117ac565b6002606555875196879363381635c960e21b85528401526101c09283918180610bfe602482018988611908565b03915afa958615610cb357859086938798610c5a575b50509161051b8792610c498489857f571b5d97d5e5253e7e627b3d73eb2d9e59aaa0c36a26d2b8ef077fdbe36a720f9861198d565b80988b519586953399429588611929565b610c4993985061051b97507f571b5d97d5e5253e7e627b3d73eb2d9e59aaa0c36a26d2b8ef077fdbe36a720f9450610c9e9250803d106105da576105bc81836116c1565b50939d959c9699959850610c14945050505050565b87513d87823e3d90fd5b6108449150873d89116106115761060381836116c1565b97508588813d8311610cfc575b610ceb81836116c1565b8101031261031e5796519685610b7e565b503d610ce1565b9150346102065760209160031991838336011261088f5784823567ffffffffffffffff811161035d578281850195823603011261035d576001600160a01b038060c95416958451632483e71560e01b8152888188818b5afa80156113f157899086906113fb575b8751632474521560e21b81528981019182523360208301529250829081906040015b03818b5afa9081156113f15790610da99186916113da575061173b565b610db8600260655414156117ac565b6002606555602480930191610dcd8383611d92565b97909487519863381635c960e21b8a528b838b01528980610df66101c0998a9486840191611908565b03818d5afa9889156113d0578796889a61139f575b5050879899610e1e86869a98999a611d92565b8d610e428a939a519a8b938493639888b5ab60e01b85528985015287840191611908565b0381845afa96871561139557908c918a98611368575b5090610ea6939291610e6a8888611d92565b8d929192518097819482937fbef48ddf000000000000000000000000000000000000000000000000000000008452878a85015288840191611908565b03915afa92831561135e578d93611323575b508b8d8560cb5416908c519e8f8681847f4aa4a4fc00000000000000000000000000000000000000000000000000000000968783525af18015611317578d9e9f9c8c819f9a9b9c9d9e84936112d7575b5089169189168203611264575050828798868394959697989960cb54169151809481938883525af190811561125a579088918391611222575b5016803b1561035d578190858f8f90519485938492632e1a7d4d60e01b84528b8401525af18015611216576111ec575b5090849392918e828e610f998f848080809e9d938e8295165af1610f93611e10565b50611e50565b868960cb54169151809481938783525af19081156111e2578f88918a936111a2575b508116911681036110ee5750818d8589938960cb54169251948593849283525af19182156110e4579086929188926110ac575b50501691823b156108935785918b91838e519586948593632e1a7d4d60e01b85528401525af180156110a257611081575b5092611060838080611065968a7f31d8533831066fbfeab87d0909f9e75d882c7551ba897456efad73b35c80419a9e9a976110769c9a165af1610f93611e10565b611d92565b979092519586953399429588611929565b0390a2600160655580f35b92611092819795929a96939461167b565b610893579294919093973861101f565b8a513d86823e3d90fd5b8193508092503d83116110dd575b6110c481836116c1565b81010312610893576110d685916117f7565b3880610fee565b503d6110ba565b8d513d89823e3d90fd5b9250509461112e945092859389938d9e9d519687958694859363a9059cbb60e01b85528401602090939291936001600160a01b0360408201951681520152565b03925af1918a831561119757611065937f31d8533831066fbfeab87d0909f9e75d882c7551ba897456efad73b35c80419a9a9b9693611076989693611060939261117a575b5050611dc5565b6111909250803d106106115761060381836116c1565b3880611173565b8a51903d90823e3d90fd5b925050508281813d83116111db575b6111bb81836116c1565b810103126111d757868f916111d082916117f7565b9290610fbb565b8780fd5b503d6111b1565b8e513d8a823e3d90fd5b9086869f938e8e9998979695611202839661167b565b9f509e9d5050509091929394959a9d610f71565b8f8e51903d90823e3d90fd5b809250858092503d8311611253575b61123b81836116c1565b8101031261035d5761124d88916117f7565b38610f41565b503d611231565b8e513d84823e3d90fd5b849161129c91849b5194858094819363a9059cbb60e01b83528d8d8401602090939291936001600160a01b0360408201951681520152565b03925af19081156111e2578e6112bb8a93869385916112c05750611dc5565b610f99565b6108279150843d86116106115761060381836116c1565b9a505050508288813d8311611310575b6112f181836116c1565b81010312610159578b8d8f998961130881926117f7565b939150610f08565b503d6112e7565b508c51903d90823e3d90fd5b9092508b81813d8311611357575b61133b81836116c1565b810103126113535761134c906117f7565b9138610eb8565b8c80fd5b503d611331565b8a513d8f823e3d90fd5b610ea69493929a506113889198508b3d8d116105895761057281836116c1565b9990999790919293610e58565b8a513d8b823e3d90fd5b899a506113bb9298999750803d106105da576105bc81836116c1565b50505050505050979150969897969538610e0b565b88513d89823e3d90fd5b61084491508a3d8c116106115761060381836116c1565b86513d87823e3d90fd5b5081813d8311611423575b61141081836116c1565b8101031261088f5788610d8c9151610d6a565b503d611406565b83823461035d578160031936011261035d5760209060ff6033541690519015158152f35b909150346102065782600319360112610206576114696115db565b6033549060ff8216156114ab575060ff1916603355513381527f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa90602090a180f35b606490602084519162461bcd60e51b8352820152601460248201527f5061757361626c653a206e6f74207061757365640000000000000000000000006044820152fd5b83823461035d578160031936011261035d576020906001600160a01b0360ca54169051908152f35b8334610159576020366003190112610159576001600160a01b0361153861157b565b6115406115db565b16806001600160a01b031960ca54161760ca55337f458609883bfc2c0eb1300d68839f0a6aa0b7a1997aba004773946caf044a06ff8380a380f35b600435906001600160a01b038216820361031e57565b90602060031983011261031e5760043567ffffffffffffffff9283821161031e578060238301121561031e57816004013593841161031e576024848301011161031e576024019190565b6001600160a01b036097541633036115ef57565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b609754906001600160a01b0380911691826001600160a01b0319821617609755167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3565b67ffffffffffffffff811161168f57604052565b634e487b7160e01b600052604160045260246000fd5b6040810190811067ffffffffffffffff82111761168f57604052565b90601f8019910116810190811067ffffffffffffffff82111761168f57604052565b919082519283825260005b84811061170f575050826000602080949584010152601f8019910116010190565b6020818301810151848301820152016116ee565b9081602091031261031e5751801515810361031e5790565b1561174257565b608460405162461bcd60e51b815260206004820152602560248201527f5065726d697373696f6e3a206f6e6c792072656c61796572206973207065726d60448201527f69747465640000000000000000000000000000000000000000000000000000006064820152fd5b156117b357565b606460405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152fd5b51906001600160a01b038216820361031e57565b919082604091031261031e576040516040810181811067ffffffffffffffff82111761168f5760405280928051600481101561031e578252602090810151910152565b9190828103906101c0821261031e57611866846117f7565b93611873602082016117f7565b93611880604083016117f7565b9360608301519360808401519360a081015193606060c08301519460df19011261031e576040516060810181811067ffffffffffffffff82111761168f5760405260e08301518152610100830151602082015261012083015190600782101561031e57611905916040820152936101806118fe82610140870161180b565b940161180b565b90565b908060209392818452848401376000828201840152601f01601f1916010190565b93979695929160a095916119459160c0875260c0870191611908565b976001600160a01b038093166020860152604085015216606083015260808201520152565b8051156119775760200190565b634e487b7160e01b600052603260045260246000fd5b60ca54604080517f095ea7b30000000000000000000000000000000000000000000000000000000081526001600160a01b0392831660048083019190915260248201889052919660009692959094909360209392858216929085816044818d885af18015611d7257611d55575b508160ca541692833b15611d5157899060848a83868f5196879586947f87517c450000000000000000000000000000000000000000000000000000000086528501521697886024840152878d16604484015265ffffffffffff421660648401525af1801561139557611d3e575b50908792918951928486850152600197888552611a83856116a5565b8b805198611a908a6116a5565b8a8a5288885b818110611d2857508291611b1c91611ae487611b2e9651938493840190602b926bffffffffffffffffffffffff19809260601b16835261017760eb1b601484015260601b1660178201520190565b0399611af8601f199b8c81018452836116c1565b83519586948d3090870152850152606084015260a0608084015260c08301906116e3565b8b60a0830152038781018352826116c1565b611b378861196a565b52611b418761196a565b5016948951967f70a082310000000000000000000000000000000000000000000000000000000094858952308a8a015286896024818b5afa988915611d1e578b99611cef575b50833b15611ceb579189928b9492611bcf8e9788519889977f24856bc300000000000000000000000000000000000000000000000000000000895288015260448701906116e3565b6003198682030160248701528351908181528a81018b808460051b84010196019489925b8d858510611cb25750505050505050508383809203925af180156113d0578392918891611c99575b50506024885180958193825230898301525afa958615611c9057508495611c60575b50508303928311611c4d57505090565b906011602492634e487b7160e01b835252fd5b9080929550813d8311611c89575b611c7881836116c1565b8101031261031e5751923880611c3d565b503d611c6e565b513d86823e3d90fd5b611ca59192935061167b565b6108935781908638611c1b565b91949786999b508194979a5080868493611cd493999699030188528b516116e3565b99019401940190938f98969394928a989693611bf3565b8a80fd5b9098508681813d8311611d17575b611d0781836116c1565b8101031261031e57519738611b87565b503d611cfd565b8c513d8d823e3d90fd5b60608c82018301528e99508f93508a9101611a96565b611d4a9098919861167b565b9638611a67565b8980fd5b611d6b90863d88116106115761060381836116c1565b50386119fa565b8b513d8c823e3d90fd5b919082604091031261031e576020825192015190565b903590601e198136030182121561031e570180359067ffffffffffffffff821161031e5760200191813603831361031e57565b15611dcc57565b606460405162461bcd60e51b815260206004820152601c60248201527f4572726f723a2063616e6e6f74207472616e7366657220746f6b656e000000006044820152fd5b3d15611e4b573d9067ffffffffffffffff821161168f5760405191611e3f601f8201601f1916602001846116c1565b82523d6000602084013e565b606090565b15611e5757565b606460405162461bcd60e51b815260206004820152601c60248201527f4572726f723a2063616e6e6f74207769746864726177206574686572000000006044820152fd5b356001600160a01b038116810361031e5790565b15611eb657565b608460405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e670000000000000000000000000000000000000000006064820152fdfea2646970667358221220968474a0cb4442ff1fadbd2ba8c5118f421d2bb0add72b65c2e1c42280092ec764736f6c63430008130033";

type PocketVaultConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PocketVaultConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PocketVault__factory extends ContractFactory {
  constructor(...args: PocketVaultConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<PocketVault> {
    return super.deploy(overrides || {}) as Promise<PocketVault>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): PocketVault {
    return super.attach(address) as PocketVault;
  }
  override connect(signer: Signer): PocketVault__factory {
    return super.connect(signer) as PocketVault__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PocketVaultInterface {
    return new utils.Interface(_abi) as PocketVaultInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PocketVault {
    return new Contract(address, _abi, signerOrProvider) as PocketVault;
  }
}
