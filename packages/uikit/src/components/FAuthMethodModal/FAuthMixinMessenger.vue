<template>
  <div class="f-auth-mixin">
    <div class="f-auth-mixin__left">
      <f-loading :loading="loading" :fullscreen="true" />
      <div v-if="!loading" class="f-auth-mixin__phone">
        <f-qr-code class="f-auth-mixin__qr" :text="qrUrl" :size="182" />
        <v-img
          class="f-auth-mixin__img"
          height="32"
          width="32"
          :src="mixin_icon"
        />
      </div>
    </div>
    <div class="f-auth-mixin__right">
      <div class="f-auth-mixin__title">
        {{ labels[0] }}
      </div>
      <div class="f-auth-mixin__subtitle">
        <i18n path="uikit.mixin_connect_detail">
          <a :href="MIXIN_DOWNLOAD_URL" class="f-auth-mixin__link">
            {{ labels[1] }}
            <v-icon size="16" color="blue">$linkBold</v-icon>
          </a>
        </i18n>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FQrCode from "../FQrCode";
import FLoading from "../FLoading";
import MixinClient from "../../services/mixin";
import { MIXIN_DOWNLOAD_URL, CONFIG, isProduct } from "../../constants";
import { $t, isValidRedirect, errorHandler } from "../../utils/helper";
import { VIcon, VImg } from "vuetify/lib";
import { isMixin } from "@foxone/utils/mixin";

@Component({
  name: "FAuthMixinMessenger",
  components: {
    VIcon,
    VImg,
    FQrCode,
    FLoading
  }
})
class FAuthMixinMessenger extends Vue {
  mixin_icon = require("../../assets/mixin_icon.svg");

  qrUrl = "";

  lastCode = "";

  loading = true;

  scheme = "";

  MIXIN_DOWNLOAD_URL = MIXIN_DOWNLOAD_URL;

  mixinClient: any = null;

  app: any = null;

  get labels() {
    return [$t(this, "scan_to_connect"), $t(this, "mixin_app")];
  }

  mounted() {
    const isFiresbox = window.location.host === "mixin-oauth.firesbox.com";

    if (isFiresbox) {
      this.mixinClient = new MixinClient(
        "https://xuexi-api.firesbox.com",
        "wss://xuexi-blaze.firesbox.com"
      );
    } else {
      this.mixinClient = new MixinClient(
        "https://api.mixin.one",
        "wss://blaze.mixin.one"
      );
    }

    this.authorize();
  }

  authorize() {
    this.loading = true;

    const clientId = CONFIG.MIXIN_CLIENT_ID;
    const scope = "PROFILE:READ ASSETS:READ";
    const codeChallenge = undefined;
    const state = "";

    console.log(isProduct);
    const redirectUriInPath = isProduct
      ? window.location.origin + "/#/auth/"
      : "https://leaf.pando.im/#/auth/";

    // const redirectUriInPath = url ;

    this.mixinClient.connect(
      (resp) => {
        if (resp.error) {
          if (resp.error.code === 400 || resp.error.code === 10002) {
            console.log(resp.error);
            this.loading = false;
            errorHandler(this, resp.error);

            return true;
          }

          return false;
        }

        this.app = resp.data.app;

        const auth = resp.data;

        if (!auth) {
          return false;
        }

        let redirectUri = auth.app.redirect_uri;

        if (redirectUriInPath && isValidRedirect(redirectUriInPath, this.app)) {
          redirectUri = redirectUriInPath;
        }

        if (redirectUri.indexOf("?") < 0) {
          redirectUri += "?";
        }

        if (auth.authorization_code.length > 16) {
          redirectUri += `code=${auth.authorization_code}&state=${state}`;
          window.location.replace(redirectUri);

          return true;
        }

        if (auth.scopes.length === 0) {
          redirectUri += "error=access_denied&state=" + state;
          window.location.replace(redirectUri);

          return true;
        }

        if (this.lastCode === auth.code_id) {
          return false;
        }

        this.lastCode = auth.code_id;
        this.scheme = "mixin://codes/" + auth.code_id;
        this.qrUrl = "https://mixin.one/codes/" + auth.code_id;
        this.loading = false;

        if (isMixin()) {
          window.location.replace(this.scheme);
        }

        return false;
      },
      clientId,
      scope,
      codeChallenge
    );
  }
}
export default FAuthMixinMessenger;
</script>
