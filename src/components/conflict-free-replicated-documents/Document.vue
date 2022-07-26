<template lang="html">
  <div class="" ref="document">
    <h2>{{ azimuth }}</h2>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import schema from "@/components/prosemirror/schema";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { clock } from "./clock";

import { baseKeymap, buildKeymap } from "@/components/prosemirror/keymap";
import shortcuts from "@/components/prosemirror/shortcuts";

export default defineComponent({
  name: "Document",
  props: {
    azimuth: {
      type: String,
      required: true,
    },
  },
  mounted: function () {
    // Prosemirror setup
    const state = EditorState.create({
      schema: schema,
      plugins: [baseKeymap, buildKeymap(schema), shortcuts(schema), clock],
    });
    const view = new EditorView(this.$refs["document"] as any, {
      state,
      plugins: [],
    });
  },
});
</script>

<style lang="css" scoped></style>
