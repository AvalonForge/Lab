<template lang="html">
  <section class="outline outline-2 outline-type relative" ref="document">
    <h2>{{ azimuth }}</h2>
    <div class="absolute" :style="{ top: 0, right: 0 }">{{ clock }}</div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import schema from "@/components/prosemirror/schema";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { collab, sendableSteps } from "prosemirror-collab";
import { keymap } from "prosemirror-keymap";

import * as Y from "yjs";
import { sync } from "./sync";
import { localundo, undo, redo } from "./undo";

import { baseKeymap, buildKeymap } from "@/components/prosemirror/keymap";
import shortcuts from "@/components/prosemirror/shortcuts";

const ids = ["Alpha", "Bravo", "Charlie"];

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
      clock: {} as any,
    };
  },
  mounted: function () {
    // Y-js setup
    const doc = new Y.Doc();
    doc.clientID = this.azimuth.toLowerCase().charCodeAt(0) - 97;
    doc.gc = false;
    const type = doc.getXmlFragment("prosemirror");

    // measurement plugin
    const measurements = new Plugin({
      view: () => {
        return {
          update: (view: EditorView) => {
            doc.store.clients.forEach((value, key) => {
              this.clock[ids[key]] = value.length;
            });
          },
        };
      },
    });

    // Prosemirror setup
    const state = EditorState.create({
      schema: schema,
      plugins: [
        baseKeymap,
        buildKeymap(schema),
        shortcuts(schema),
        keymap({
          "Mod-z": undo,
          "Mod-y": redo,
        }),
        sync(type as any, {}),
        localundo({}),
        measurements,
        collab(),
      ],
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
