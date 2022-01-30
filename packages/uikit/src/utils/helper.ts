export const $t = (vm, key: string) => {
  return vm.$vuetify.lang.t("$vuetify.uikit." + key);
};

export function getBrowser() {
  const ua = navigator.userAgent.toLowerCase();

  if (ua.indexOf("firefox") > -1) {
    return "firefox";
  }

  if (ua.indexOf("chrome") > -1) {
    return "chrome";
  }

  return "others";
}

export function errorHandler(vm: Vue, error: any) {
  const code = error.code;
  const message = error.message || error.description || "Unknown Error";

  vm.$uikit.toast.error({ message: `${code} ${message}` });
}

export function isValidRedirect(path, { resource_patterns }) {
  try {
    if (!path.startsWith("http")) {
      return false;
    }

    const host = new URL(path).host;
    const patterns = resource_patterns || [];

    for (const pattern of patterns) {
      if (pattern.startsWith("http:") || pattern.startsWith("https:")) {
        if (new URL(pattern).host === host) {
          return true;
        }
      } else {
        if (new RegExp(pattern).test(host)) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    return false;
  }
}
