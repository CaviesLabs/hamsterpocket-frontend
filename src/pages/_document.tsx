import { Html, Head, Main, NextScript } from "next/document";
import { SeoComponent } from "@/src/components/seo";

export default function Document() {
  return (
    <Html>
      <Head>
        <SeoComponent />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
        {typeof window === "undefined" && (
          <style
            id="holderStyle"
            dangerouslySetInnerHTML={{
              __html: `
         *, *::before, *::after {
           transition: none!important;
         }
         `,
            }}
          />
        )}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-TZBPGENQEF"
        ></script>
        <script>
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-TZBPGENQEF');`}
        </script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.2/flowbite.min.js"></script>
    </Html>
  );
}
