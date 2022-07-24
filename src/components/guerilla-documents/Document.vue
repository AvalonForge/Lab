<template lang="html">
  <section class="outline outline-2 outline-type" ref="document">
    <h2>{{ azimuth }}</h2>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import schema from "@/components/prosemirror/schema";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

import * as Y from "yjs";
import { ySyncPlugin } from "y-prosemirror";

import keymap from "@/components/prosemirror/keymap";
import shortcuts from "@/components/prosemirror/shortcuts";

export default defineComponent({
  name: "Document",
  props: {
    azimuth: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      getDoc: () => {
        //
      },
      getView: () => {
        //
      },
    };
  },
  mounted: function () {
    const doc = new Y.Doc();
    const type = doc.getXmlFragment("prosemirror");
    const state = EditorState.create({
      schema: schema,
      plugins: [keymap(schema), shortcuts(schema), ySyncPlugin(type as any)],
    });
    const view = new EditorView(this.$refs["document"] as any, {
      state,
      plugins: [],
    });
    this.getDoc = () => {
      return doc;
    };
    this.getView = () => {
      return view;
    };
  },
});
</script>

<style lang="css" scoped></style>
