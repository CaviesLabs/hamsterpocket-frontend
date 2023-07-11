require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "dev"}`,
});

/** @dev Define NODE_ENV to next config. */
const NODE_ENV = process.env.NODE_ENV;
//
// /** @dev Config PWA for next app. */
// const withPWA = require("next-pwa")({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "dev",
// });

/** @type {import("next").NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: [
    "@hamsterbox/ui-kit",
    "react-icons",
    "antd",
    // "@saberhq/solana-contrib",
    // "@saberhq/use-solana",
  ],
  experimental: {
    esmExternals: true,
    appDir: true,
    serverComponentsExternalPackages: ["@ethereumjs"],
  },
  env: {
    ENV: NODE_ENV,
    HOST_URL: process.env.HOST_URL,
    API_URL: process.env.API_URL,
    HOST_NAME: process.env.HOST_NAME,
    SWAP_PROGRAM_ADDRESS: process.env.SWAP_PROGRAM_ADDRESS,
    SOLANA_CLUSTER: process.env.SOLANA_CLUSTER,
    SOLANA_RPC_URL: process.env.SOLANA_RPC_URL,
    ALCHEMY_ID: process.env.ALCHEMY_ID,
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID,
    EVM_CHAIN_ID: process.env.EVM_CHAIN_ID,
    EVM_CONTRACT_ADDRESS: process.env.EVM_CONTRACT_ADDRESS,
    EVM_REGISTRY_ADDRESS: process.env.EVM_REGISTRY_ADDRESS,
    APTOS_NODE_URL: process.env.APTOS_NODE_URL,
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: "secret",
    secondSecret: process.env.SECOND_SECRET, // Pass through env variables
  },
  publicRuntimeConfig: {},
  devIndicators: {
    buildActivity: false,
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/bnb/",
      },
    ];
  },
  webpack: (config) => {
    // config.watchOptions = { ignored: ["node_modules"] };
    // config.experiments = { ...config.experiments, topLevelAwait: true };
    // config.ignoreWarnings = [
    //   { module: /node_modules\/@ethereumjs\/lib\/index\.js/ },
    //   { file: /node_modules\/@ethereumjs\/lib\/index\.js/ },
    // ];
    config.module.rules.push({
      test: /\.node$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
    });
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
