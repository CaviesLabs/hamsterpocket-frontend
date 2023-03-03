import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from "axios";
import qs from "qs";

export type RequestConfig = Partial<AxiosRequestConfig>;

export class CoingeckoProvider {
  /**
   * Default network options
   * @private
   */
  private defaultNetWorkOptions: RawAxiosRequestHeaders = {
    "Content-Type": "application/json",
  };

  /**
   * @param url
   * @param requestConfig
   * @returns
   * @description
   * The function to request to the api
   */
  async request<RequestResponse>(
    url: string,
    requestConfig: RequestConfig
  ): Promise<RequestResponse> {
    const resp = await axios(url, {
      ...requestConfig,
      baseURL: "https://api.coingecko.com/api/v3",
      paramsSerializer: {
        serialize: (params: any) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      },
      headers: {
        ...this.defaultNetWorkOptions,
        ...requestConfig.headers,
      },
    } as any).catch((e) => e.response);

    if (!resp || resp?.status >= 400) {
      throw new Error(`Error when request server, ${resp?.statusText}`);
    }

    let jsonData = resp.data;
    try {
      jsonData = JSON.parse(resp.data);
    } catch {}

    return jsonData as RequestResponse;
  }
}

export const coingeckoProvider = new CoingeckoProvider();
