import Http from "./http";
import { AxiosRequestConfig } from "axios";
import { MIXIN_HOST } from "@doc/constants";

export default function (http: Http) {
  return {
    auth(code: string): Promise<any> {
      return http.post("/login", { data: { code } });
    },

    config(options: AxiosRequestConfig): void {
      http.config(options);
    },

    async getAssetsFromMixin(): Promise<API.MixinAsset[]> {
      return await http.get(`${MIXIN_HOST}/assets`);
    },

    async getAssetFromMixin(id: string): Promise<API.MixinAsset> {
      return await http.get(`${MIXIN_HOST}/assets/${id}`);
    }
  };
}
