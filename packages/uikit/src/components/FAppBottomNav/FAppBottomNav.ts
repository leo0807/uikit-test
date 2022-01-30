import "./FAppBottomNav.scss";

import mixins from "vuetify/src/util/mixins";

import { VBottomNavigation, VBtn, VIcon } from "vuetify/src/components";

// types
import { VNode, PropType } from "vue";

export interface NavItem {
  text: string;
  icon: string;
  value: string;
}

export default mixins(VBottomNavigation).extend({
  name: "FBottomNavigation",

  props: {
    items: { type: Array as PropType<NavItem[]>, default: () => [] },
    customContent: { type: Boolean, default: false },
    flat: { type: Boolean, default: false },
    height: { type: [String, Number], default: "66" }
  },

  computed: {
    classes(): object {
      return {
        ...VBottomNavigation.options.computed.classes.call(this),
        "f-bottom-navigation": true,
        "f-bottom-navigation--flat": this.flat
      };
    }
  },

  methods: {
    genBtn({ icon, text, value }): VNode {
      const h = this.$createElement;

      return h(VBtn, { props: { ripple: false, value } }, [
        h("span", { staticClass: "mt-2" }, text),
        h(VIcon, icon)
      ]);
    }
  },

  render(h): VNode {
    if (!this.customContent) {
      this.$slots.default = this.items.map((item) => this.genBtn(item));
    }

    const render = VBottomNavigation.options.render.call(this, h);

    return render;
  }
});
