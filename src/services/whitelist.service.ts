import { networkProvider } from "@/src/providers/network.provider";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";

export class WhitelistService {
  public async getWhitelist(): Promise<WhitelistEntity[]> {
    return networkProvider.request<WhitelistEntity[]>(`/whitelist`, {
      method: "GET",
    });
  }
}

export const whitelistService = new WhitelistService();
