import { FC, useMemo } from "react";
import { useRouter } from "next/router";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { HamsterboxIcon, CaviesIcon } from "@/src/components/icons";

interface FooterItem {
  name: string;
  uri: string;
  newWindow?: boolean | true;
}

interface SocialItem {
  image: string;
  uri: string;
}

const Footer: FC = () => {
  const router = useRouter();
  const { pushRouterWithChainId, chainId } = usePlatformConfig();

  const footers = useMemo<FooterItem[]>(
    () => [
      {
        name: "About Us",
        uri: "https://cavies.notion.site/About-Cavies-72e60c00426b450e8e57ca3ea5acb0d0",
      },
      {
        name: "Contact Us",
        uri: "mailto:contact@cavies.xyz",
      },
    ],
    []
  );

  const socialItems = useMemo<SocialItem[]>(
    () => [
      {
        image: "/assets/images/twitter.svg",
        uri: "https://twitter.com/CaviesLabs",
      },
    ],
    []
  );

  return router.asPath === `/${chainId}` || router.asPath === `/${chainId}/` ? (
    <div className="footer pb-9 mobile:hidden">
      <div className="lg:max-w-[1440px] lg:mx-auto">
        <div className="md:flex justify-between items-end">
          <div className="menu-wrapper md:pt-0">
            <ul className="footer-menu w-[100%] hidden md:flex justify-center flex-wrap md:justify-start">
              {footers.map((item, index) => (
                <li
                  key={`footer-item-${index}`}
                  className="text-center mr-2 leading-[35px] md:leading-[25px]"
                >
                  <a
                    target={item.newWindow === false ? "" : "_blank"}
                    href={item.uri}
                    className="p-2 text-[14px] md:text-[14px] normal-text text-footerItemColor dark:text-footerItemColorDark regular-text"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative left-[120px]">
            <a onClick={() => pushRouterWithChainId("/")}>
              <HamsterboxIcon
                className="w-[155px] h-auto  mx-auto cursor-pointer"
                color="white"
              />
            </a>
            <div className="flex mx-auto mt-[14px] justify-center items-start">
              <div className="top-0 regular-text text-[14px] mr-[5px] text-dark30">
                by
              </div>
              <a href="https://cavies.xyz/" target="_blank">
                <CaviesIcon className="w-[110px] h-auto" />
              </a>
            </div>
          </div>

          <div className="menu-wrapper md:pt-0 pt-[20px]">
            <ul className="footer-menu w-[100%] flex md:hidden justify-center flex-wrap md:justify-start">
              {footers.map((item, index) => (
                <li
                  key={`footer-item-${index}`}
                  className="text-center mr-2 leading-[35px] md:leading-[25px]"
                >
                  <a
                    target={item.newWindow === false ? "" : "_blank"}
                    href={item.uri}
                    className="p-2 text-[14px] md:text-[14px] normal-text text-footerItemColor dark:text-footerItemColorDark regular-text"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-end">
            <ul className="footer-menu relative hidden md:block mb-6">
              {socialItems.map((item, index) => (
                <li
                  key={`footer-item-${index}`}
                  className="ml-[20px] md:ml-[30px] cursor-pointer"
                  onClick={() => window.open(item.uri)}
                >
                  <img
                    src={item.image}
                    className="text-[10px] md:text-[16px] w-[15px] h-[15px] md:w-[18px] md:h-[18px]"
                  />
                </li>
              ))}
            </ul>
            <div className="bottom-menu-wrapper hidden md:block">
              <p className="text-footerItemColor dark:text-footerItemColorDark text-[12px] md:text-[14px] regular-text">
                © 2022 Cavies Ltd.
              </p>
            </div>
          </div>
        </div>
        <div className="block md:hidden pt-[20px]">
          <div>
            <ul className="footer-menu w-[100%] flex justify-center">
              {socialItems.map((item, index) => (
                <li
                  key={`footer-item-${index}`}
                  className="mx-[20px] md:ml-[30px] cursor-pointer"
                  onClick={() => window.open(item.uri)}
                >
                  <img
                    src={item.image}
                    className="w-[18.8px] h-[18.8px] md:w-[18px] md:h-[18px]"
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-[20px]">
            <p className="text-footerItemColor dark:text-footerItemColorDark text-[12px] md:text-[14px] cursor-pointer normal-text text-center">
              © 2022 Cavies Ltd.
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Footer;
