<template lang="html">
  <article class="" ref="doc"></article>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import schema from "@/components/prosemirror/schema";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { baseKeymap, buildKeymap } from "@/components/prosemirror/keymap";
import shortcuts from "@/components/prosemirror/shortcuts";
import { versions, dispatchTransaction } from "./versions";

export default defineComponent({
  name: "Document",
  props: {
    getSelectedCommits: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      getDoc: () => {
        //
      },
    };
  },
  mounted: function () {
    const state = EditorState.create({
      schema: schema,
      plugins: [
        baseKeymap,
        buildKeymap(schema),
        shortcuts(schema),
        versions(() => {
          return this.getSelectedCommits() as Array<number>;
        }),
      ],
    });
    const view = new EditorView(this.$refs["doc"] as any, {
      state,
      plugins: [],
      dispatchTransaction: dispatchTransaction,
    });
    this.getDoc = () => {
      return view;
    };
  },
});
</script>

<style lang="css" scoped></style>
