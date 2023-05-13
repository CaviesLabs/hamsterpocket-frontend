"use strict";

require("dotenv").config({
  path: ".env.".concat(process.env.NODE_ENV === "production" ? "dev" : process.env.NODE_ENV)
});

var withTM = require("next-transpile-modules")(["@hamsterbox/ui-kit", "react-icons"]); // const withPlugins = require("next-compose-plugins");

/** @dev Define NODE_ENV to next config. */


var NODE_ENV = process.env.NODE_ENV;
/** @dev Config PWA for next app. */

var withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "dev"
});
/** @type {import('next').NextConfig} */


module.exports = withPWA(withTM({
  source: "/",
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
    transpilePackages: ["antd"]
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
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: "secret",
    secondSecret: process.env.SECOND_SECRET // Pass through env variables

  },
  publicRuntimeConfig: {},
  devIndicators: {
    buildActivity: false
  }
}));