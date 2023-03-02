require("dotenv").config({
  path: `.env.${
    process.env.NODE_ENV === "production" ? "dev" : process.env.NODE_ENV
  }`,
});

const withTM = require("next-transpile-modules")([
  "@hamsterbox/ui-kit",
  "react-icons",
]);
const withPlugins = require("next-compose-plugins");

/** @dev Define NODE_ENV to next config. */
const NODE_ENV = process.env.NODE_ENV;

/** @dev Config PWA for next app. */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "dev",
});

/** @type {import('next').NextConfig} */
module.exports = withPlugins([withPWA, withTM], {
  source: "/",
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
    transpilePackages: ["antd"],
  },
  env: {
    ENV: NODE_ENV,
    HOST_URL: process.env.HOST_URL,
    API_URL: process.env.API_URL,
    HOST_NAME: process.env.HOST_NAME,
    SWAP_PROGRAM_ADDRESS: process.env.SWAP_PROGRAM_ADDRESS,
    SOLANA_CLUSTER: process.env.SOLANA_CLUSTER,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL}/api/:path*`,
      },
    ];
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
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ["en-US", "es", "fr", "nl-NL"],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "en-US",
    // This is a list of locale domains and the default locale they
    // should handle (these are only required when setting up domain routing)
    domains: [
      {
        domain: "dev-pocket-fe.hamsterbox.com",
        defaultLocale: "en-US",
        // other locales that should be handled on this domain
        locales: ["es"],
      },
      {
        domain: "dev-pocket.hamsterbox.com",
        defaultLocale: "en-US",
        // other locales that should be handled on this domain
        locales: ["es"],
      },
    ],
  },
});
