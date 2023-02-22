import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { whitelistService } from "@/src/services/whitelist.service";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";

/** @dev Initiize context. */
export const WhitelistContext = createContext<any>(null);

type WhitelistObj = {
  [key: string]: WhitelistEntity;
};
export const WhitelistProvider: FC<{ children: ReactNode }> = (props) => {
  const [whitelist, setWhitelist] = useState<any>(null);

  useEffect(() => {
    whitelistService.getWhitelist().then((result) => {
      const res: WhitelistObj = {};
      result.forEach((_) => {
        res[_.address] = _;
      });
      setWhitelist(res);
    });
  }, []);

  return (
    <WhitelistContext.Provider value={{ whitelist }}>
      {props.children}
    </WhitelistContext.Provider>
  );
};
