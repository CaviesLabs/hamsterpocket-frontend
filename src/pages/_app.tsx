import "../../styles/globals.css";
import "@hamsterbox/ui-kit/dist/cjs/styles/css/main.css";
import Script from "next/script";
import makeStore from "@/src/redux";
import type { AppProps } from "next/app";
import { FC } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@hamsterbox/ui-kit";
import { WalletKitProvider } from "@gokiprotocol/walletkit";
import { WalletProvider } from "@/src/hooks/useWallet";
import { MainProvider } from "@/src/hooks/pages/main";

import {
  legacyLogicalPropertiesTransformer,
  StyleProvider,
} from "@ant-design/cssinjs";
import {
  EvmWalletKitProvider,
  EvmWalletProvider,
} from "@/src/hooks/useEvmWallet";
import {
  AptosWalletKitProvider,
  AptosWalletProvider,
} from "@/src/hooks/useAptos";
import { AppWalletProvider } from "@/src/hooks/useAppWallet";
import { WhitelistProvider } from "@/src/hooks/useWhitelist";
import { PlatformConfigProvider } from "@/src/hooks/usePlatformConfig";

/**
 * @dev Import needed third-party styled.
 */
import "flowbite";
import "@rainbow-me/rainbowkit/styles.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Network } from "@saberhq/solana-contrib";

const store = makeStore();

const AppComponent: FC<{ Component: any; pageProps: any }> = ({
  Component,
  pageProps,
}) => {
  return <Component {...pageProps} />;
};

function MyApp({ Component, pageProps }: AppProps) {
  /** @dev Process to select blockchain network. */
  const network = process.env.SOLANA_CLUSTER as Network;

  return (
    <Provider store={store}>
      <StyleProvider
        ssrInline={true}
        transformers={[legacyLogicalPropertiesTransformer]}
      >
        <ThemeProvider>
          {/**
           * @dev
           * NextJs recommend do only add stylesheets in SEO component
           */}
          <Script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
            crossOrigin="anonymous"
          />
          <PlatformConfigProvider>
            {/**
             * @dev
             * Wrap the whole app in Goki Kit provider for use.
             */}
            <WalletKitProvider
              defaultNetwork={network}
              app={{
                name: "Hamsterpocket",
                icon: (
                  <img
                    className="bg-dark60 rounded-full"
                    src="/assets/icons/favicon-196.png"
                  />
                ),
              }}
              debugMode={false} // you may want to set this in REACT_APP_DEBUG_MODE
            >
              <WalletProvider>
                <MainProvider>
                  <EvmWalletKitProvider>
                    <EvmWalletProvider>
                      <AptosWalletKitProvider>
                        <AptosWalletProvider>
                          <AppWalletProvider>
                            <WhitelistProvider>
                              <AppComponent {...{ Component, pageProps }} />
                            </WhitelistProvider>
                          </AppWalletProvider>
                        </AptosWalletProvider>
                      </AptosWalletKitProvider>
                    </EvmWalletProvider>
                  </EvmWalletKitProvider>
                </MainProvider>
              </WalletProvider>
            </WalletKitProvider>
          </PlatformConfigProvider>
        </ThemeProvider>
      </StyleProvider>
    </Provider>
  );
}

export default MyApp;
