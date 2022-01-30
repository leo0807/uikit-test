export const MIXIN_DOWNLOAD_URL = "https://mixin.one/messenger";

export const isProduct = process.env.NODE_ENV === "production";

export const CONFIG = isProduct
  ? {
      API_BASE: "https://leaf-api.pando.im/api/",
      WS_BASE: "wss://",
      MIXIN_CLIENT_ID: "75f18fe8-b056-46d6-9c48-0214425e58ce"
    }
  : {
      API_BASE: "https://pando-test-api.fox.one/api/",
      WS_BASE: "wss://",
      MIXIN_CLIENT_ID: "670e1faa-2975-48d9-a81f-cd0905ae847e"
    };
