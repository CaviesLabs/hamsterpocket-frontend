"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
require("../../styles/globals.css");
require("@hamsterbox/ui-kit/dist/cjs/styles/css/main.css");
var script_1 = require("next/script");
var redux_1 = require("@/src/redux");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var ui_kit_1 = require("@hamsterbox/ui-kit");
var walletkit_1 = require("@gokiprotocol/walletkit");
var useWallet_1 = require("@/src/hooks/useWallet");
var main_1 = require("@/src/hooks/pages/main");
var wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
var web3_js_1 = require("@solana/web3.js");
var wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
var wallet_adapter_wallets_1 = require("@solana/wallet-adapter-wallets");
var cssinjs_1 = require("@ant-design/cssinjs");
var useEvmWallet_1 = require("@/src/hooks/useEvmWallet");
var useWhitelist_1 = require("@/src/hooks/useWhitelist");
/**
 * @dev Import needed third-party styled.
 */
require("flowbite");
require("react-responsive-carousel/lib/styles/carousel.min.css");
require("@rainbow-me/rainbowkit/styles.css");
var store = redux_1["default"]();
var AppComponent = function (_a) {
    var Component = _a.Component, pageProps = _a.pageProps;
    return React.createElement(Component, __assign({}, pageProps));
};
function MyApp(_a) {
    var Component = _a.Component, pageProps = _a.pageProps;
    /** @dev Process to select blockchain network. */
    var network = process.env.SOLANA_CLUSTER;
    /** @dev Initilize needed wallet adapters. */
    var walletAdapters = react_1.useMemo(function () {
        return [
            new wallet_adapter_wallets_1.PhantomWalletAdapter(),
            new wallet_adapter_wallets_1.BraveWalletAdapter(),
            new wallet_adapter_wallets_1.Coin98WalletAdapter(),
            new wallet_adapter_wallets_1.LedgerWalletAdapter(),
            new wallet_adapter_wallets_1.SolflareWalletAdapter(),
            new wallet_adapter_wallets_1.SolletWalletAdapter(),
        ];
    }, [network]);
    return (React.createElement(react_redux_1.Provider, { store: store },
        React.createElement(cssinjs_1.StyleProvider, { ssrInline: true, transformers: [cssinjs_1.legacyLogicalPropertiesTransformer] },
            React.createElement(ui_kit_1.ThemeProvider, null,
                React.createElement(script_1["default"], { src: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js", integrity: "sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW", crossOrigin: "anonymous" }),
                React.createElement(wallet_adapter_react_1.ConnectionProvider, { endpoint: network === wallet_adapter_base_1.WalletAdapterNetwork.Mainnet
                        ? process.env.SOLANA_RPC_URL
                        : web3_js_1.clusterApiUrl(network) },
                    React.createElement(wallet_adapter_react_1.WalletProvider, { wallets: walletAdapters },
                        React.createElement(walletkit_1.WalletKitProvider, { defaultNetwork: network, app: {
                                name: "Hamsterswap",
                                icon: (React.createElement("img", { className: "bg-dark60 rounded-full", src: "/assets/icons/favicon-196.png" }))
                            }, debugMode: false },
                            React.createElement(useWallet_1.WalletProvider, null,
                                React.createElement(main_1.MainProvider, null,
                                    React.createElement(useWhitelist_1.WhitelistProvider, null,
                                        React.createElement(useEvmWallet_1.EvmWalletKitProvider, null,
                                            React.createElement(AppComponent, __assign({}, { Component: Component, pageProps: pageProps })))))))))))));
}
exports["default"] = MyApp;
