<template lang="html">
  <article ref="article">
    <ContextMenuNode v-if="menu" :menu="menu" :view="view" />
  </article>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ContextMenuNode from "./ContextMenuNode.vue";
import { ContextMenu } from "./contextmenu";

import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import schema from "./schema";

// UX
import keymap from "./keymap";
import shortcuts from "./shortcuts";

// Enriched Views
import { markup } from "./markup";
import { imageView } from "./imageView";

//Menus
import { slashmenu } from "./slashmenu";

export default defineComponent({
  name: "Document",
  components: {
    ContextMenuNode,
  },
  data: function () {
    return {
      menu: null as null | ContextMenu,
      menuKey: 0,
      view: null as any,
    };
  },
  mounted: function () {
    console.log("Mounted Document");
    const state = EditorState.create({
      schema: schema,
      plugins: [
        // UX
        keymap,
        shortcuts,
        // Enriched Views
        markup,
        imageView,
        // Baubles
        slashmenu((newMenu: ContextMenu | null) => {
          this.menu = newMenu;
        }),
      ],
    });
    this.view = new EditorView(this.$refs["article"] as any, {
      state: state,
      plugins: [],
    });
  },
  beforeUnmount: function () {
    console.log("Before Unmount");
  },
});
</script>

<style lang="css" scoped>
@import "./prosemirror.css";
@import "./document.css";
</style>
