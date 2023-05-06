"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.deployFixtures = void 0;
// We define a fixture to reuse the same setup in every test.
// We use loadFixture to run this setup once, snapshot that state,
// and reset Hardhat Network to that snapshopt in every test.
var hardhat_1 = require("hardhat");
var hardhat_network_helpers_1 = require("@nomicfoundation/hardhat-network-helpers");
function deployFixtures() {
    return __awaiter(this, void 0, void 0, function () {
        var owner, owner2, operator, BTCBOwner, Multicall3Contract, Multicall3, MockedERC20Contract, MockedERC20, PocketChefContract, Chef, PocketRegistryContract, Registry, PocketVaultContract, Vault;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getImpersonatedSigner("0x4b16c5de96eb2117bbe5fd171e4d203624b014aa")];
                case 1:
                    owner = _a.sent();
                    return [4 /*yield*/, hardhat_1.ethers.getImpersonatedSigner("0xa180Fe01B906A1bE37BE6c534a3300785b20d947")];
                case 2:
                    owner2 = _a.sent();
                    return [4 /*yield*/, hardhat_1.ethers.getImpersonatedSigner("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")];
                case 3:
                    operator = _a.sent();
                    return [4 /*yield*/, hardhat_1.ethers.getImpersonatedSigner("0xF68a4b64162906efF0fF6aE34E2bB1Cd42FEf62d")];
                case 4:
                    BTCBOwner = _a.sent();
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory("Multicall3")];
                case 5:
                    Multicall3Contract = _a.sent();
                    return [4 /*yield*/, Multicall3Contract.connect(owner).deploy()];
                case 6:
                    Multicall3 = (_a.sent());
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory("MockedERC20")];
                case 7:
                    MockedERC20Contract = _a.sent();
                    return [4 /*yield*/, MockedERC20Contract.connect(owner).deploy()];
                case 8:
                    MockedERC20 = (_a.sent());
                    /**
                     * @dev Funding erc20
                     */
                    return [4 /*yield*/, MockedERC20.connect(owner).transfer(owner2.address, hardhat_1.ethers.BigNumber.from(hardhat_1.ethers.constants.WeiPerEther).mul(20))];
                case 9:
                    /**
                     * @dev Funding erc20
                     */
                    _a.sent();
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory("PocketChef")];
                case 10:
                    PocketChefContract = _a.sent();
                    return [4 /*yield*/, hardhat_1.upgrades.deployProxy(PocketChefContract.connect(owner), [], {
                            unsafeAllow: ["constructor", "delegatecall"]
                        })];
                case 11:
                    Chef = (_a.sent());
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory("PocketRegistry")];
                case 12:
                    PocketRegistryContract = _a.sent();
                    return [4 /*yield*/, hardhat_1.upgrades.deployProxy(PocketRegistryContract.connect(owner), [], {
                            unsafeAllow: ["constructor"]
                        })];
                case 13:
                    Registry = (_a.sent());
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory("PocketVault")];
                case 14:
                    PocketVaultContract = _a.sent();
                    return [4 /*yield*/, hardhat_1.upgrades.deployProxy(PocketVaultContract.connect(owner), [], {
                            unsafeAllow: ["constructor"]
                        })];
                case 15:
                    Vault = (_a.sent());
                    /**
                     * @dev Configure registry
                     */
                    return [4 /*yield*/, Registry.connect(owner).grantRole(Registry.OPERATOR(), operator.address)];
                case 16:
                    /**
                     * @dev Configure registry
                     */
                    _a.sent();
                    return [4 /*yield*/, Registry.connect(owner).grantRole(Registry.RELAYER(), Chef.address)];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, Registry.connect(owner).grantRole(Registry.RELAYER(), Vault.address)];
                case 18:
                    _a.sent();
                    /**
                     * @dev Whitelist addresses
                     */
                    return [4 /*yield*/, Registry.whitelistAddress("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB
                        true)];
                case 19:
                    /**
                     * @dev Whitelist addresses
                     */
                    _a.sent();
                    return [4 /*yield*/, Registry.whitelistAddress("0x55d398326f99059fF775485246999027B3197955", // USDT
                        true)];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, Registry.whitelistAddress("0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c", // BTCB
                        true)];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, Registry.whitelistAddress("0x5Dc88340E1c5c6366864Ee415d6034cadd1A9897", // Universal router
                        true)];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, Registry.whitelistAddress("0x000000000022d473030f116ddee9f6b43ac78ba3", // permit2
                        true)];
                case 23:
                    _a.sent();
                    /**
                     * @dev Linking components
                     */
                    return [4 /*yield*/, Vault.connect(owner).setRegistry(Registry.address)];
                case 24:
                    /**
                     * @dev Linking components
                     */
                    _a.sent();
                    return [4 /*yield*/, Vault.connect(owner).setPermit2("0x000000000022d473030f116ddee9f6b43ac78ba3")];
                case 25:
                    _a.sent();
                    return [4 /*yield*/, Chef.connect(owner).setRegistry(Registry.address)];
                case 26:
                    _a.sent();
                    return [4 /*yield*/, Chef.connect(owner).setVault(Vault.address)];
                case 27:
                    _a.sent();
                    Chef.interface.abi;
                    /**
                     * @dev return
                     */
                    return [2 /*return*/, {
                            Time: hardhat_network_helpers_1.time,
                            Provider: hardhat_1.ethers.provider,
                            MockedERC20: MockedERC20,
                            Registry: Registry,
                            Vault: Vault,
                            Chef: Chef,
                            owner: owner,
                            owner2: owner2,
                            operator: operator,
                            Multicall3: Multicall3,
                            BTCBOwner: BTCBOwner,
                            WBNBAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
                            USDTAddress: "0x55d398326f99059fF775485246999027B3197955",
                            BTCBAddress: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
                            RouterAddress: "0x5Dc88340E1c5c6366864Ee415d6034cadd1A9897",
                            Permit2Address: "0x000000000022d473030f116ddee9f6b43ac78ba3"
                        }];
            }
        });
    });
}
exports.deployFixtures = deployFixtures;
