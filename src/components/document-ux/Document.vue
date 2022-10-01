<template lang="html">
  <article ref="article">
    <div class="context-menu">
      <component :is="menu" />
    </div>
  </article>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import schema from "./schema";
import keymap from "./keymap";
import shortcuts from "./shortcuts";

export default defineComponent({
  name: "Document",
  data: function () {
    return {
      menu: null,
    };
  },
  mounted: function () {
    console.log("Mounted Document");
    const state = EditorState.create({
      schema: schema,
      plugins: [keymap, shortcuts],
    });
    const view = new EditorView(this.$refs["article"] as any, {
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
