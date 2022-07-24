<template lang="html">
  <div class="flex gap-12 relative flex-wrap">
    <div
      class="relative overflow-y-auto scrollbar-sm overflow-x-hidden"
      :style="{ 'flex-basis': '60ch' }"
      v-if="editor"
    >
      <Cursors :cursors="Object.values(cursors)" :view="editor.view">
        <editor-content
          :editor="editor"
          class="flex flex-col rounded-mention"
          :class="{
            placeholder:
              editor.state.doc.textContent.length < 1 && !editor.isFocused,
          }"
          :style="{
            height: '100%',
            'max-height': '80vh',
            'min-height': '40vh',
          }"
          id="editor"
        />
      </Cursors>
    </div>

    <div
      class="flex-grow soundboard"
      :style="{ 'min-width': '180px' }"
      v-if="editor"
    >
      <Soundboard
        :editor="editor"
        :cursors="Object.values(cursors)"
        :user="user"
        class=""
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Cursors from "./Cursors.vue";
import Soundboard from "./Soundboard.vue";

import { Editor, EditorContent } from "@tiptap/vue-3";
import { Transaction } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

import Document from "./extensions/document";
import Collaboration from "./extensions/collaboration";
import { Cursor as CursorInterface } from "./extensions/collaboration";
import TransactionCounter from "./extensions/transaction-counter";
import SelectionHighlight from "./extensions/selection-highlight";
import DropCursor from "./extensions/drop-cursor";

//import Row from "./extensions/row";
//import Column from "./extensions/column";

import Text from "@tiptap/extension-text";
import Paragraph from "./extensions/paragraph";
import Heading from "./extensions/heading";
import ListItem from "./extensions/listitem";
import Ordered from "./extensions/ordered";
import Unordered from "./extensions/unordered";

import Bold from "./extensions/bold";
import Italic from "./extensions/italic";
import Strike from "./extensions/strike";

import Code from "./extensions/code";
import Toggle from "./extensions/toggle";

export default defineComponent({
  name: "Editor",
  components: {
    EditorContent,
    Cursors,
    Soundboard,
  },
  data() {
    return {
      editor: null as null | Editor,
      websocket: null as null | WebSocket,
      user: { uid: "", name: "", color: "" } as {
        uid: string;
        name: string;
        color: string;
      },
      cursors: {} as { [key: string]: any },
    };
  },
  created: function () {
    this.websocket = new WebSocket(
      "wss://competition.keryx.workers.dev/room/public/217795cd245a42aec7deb9f08a58816cdc4fde0317e45e3135d0eb575036afd3/websocket"
    );
    const loadEditor = () => {
      this.editor = new Editor({
        extensions: [
          Document,
          Collaboration(
            this.websocket as WebSocket,
            this.setUser,
            this.setCursor,
            this.mapCursors,
            this.getCursorHighlights
          ),
          TransactionCounter,

          //Slash
          SelectionHighlight,
          DropCursor,
          //Row,
          //Column,
          Text,
          Paragraph,
          Heading,
          ListItem,
          Ordered,
          Unordered,

          Bold,
          Italic,
          Strike,

          Code,
          Toggle,
        ],
        content: "",
      });
    };
    if (this.websocket.readyState == 1) loadEditor();
    else
      this.websocket.addEventListener("open", () => {
        loadEditor();
      });
  },
  methods: {
    getCursorHighlights: function (doc: any): DecorationSet {
      return DecorationSet.create(
        doc,
        Object.keys(this.cursors)
          .filter(
            (cursor) =>
              this.cursors[cursor].pos != null &&
              this.cursors[cursor].pos.head != this.cursors[cursor].pos.anchor
          )
          .map((cursor) => {
            if (
              this.cursors[cursor].pos.anchor < this.cursors[cursor].pos.head
            ) {
              return Decoration.inline(
                this.cursors[cursor].pos.anchor,
                this.cursors[cursor].pos.head,
                {
                  style:
                    "background-color:" + this.cursors[cursor].color + "33",
                }
              );
            } else {
              return Decoration.inline(
                this.cursors[cursor].pos.head,
                this.cursors[cursor].pos.anchor,
                {
                  style:
                    "background-color:" + this.cursors[cursor].color + "33",
                }
              );
            }
          })
      );
    },
    mapCursors: function (tr: any) {
      Object.keys(this.cursors)
        .filter((cursor) => this.cursors[cursor].pos != null)
        .forEach((cursor) => {
          //console.log(mapping);
          this.cursors[cursor].pos.anchor = tr.mapping.map(
            this.cursors[cursor].pos.anchor
          );
          this.cursors[cursor].pos.head = tr.mapping.map(
            this.cursors[cursor].pos.head
          );
        });
    },
    setCursor: function (cursor: CursorInterface) {
      if (cursor.type == "+") {
        this.cursors[cursor.uid] = {
          uid: cursor.uid,
          name: cursor.name,
          color: cursor.color,
          pos: cursor.pos,
        };
      } else if (cursor.type == "-") {
        delete this.cursors[cursor.uid];
      } else if (cursor.type == "=") {
        this.cursors[cursor.uid].pos = cursor.pos;
      }
    },
    setUser: function (user: { uid: string; name: string; color: string }) {
      this.user = user;
    },
  },
});
</script>

<style lang="css" scoped>
:deep(.ProseMirror) {
  @apply flex-grow;
}

.placeholder::before {
  @apply text-type-glass text-body;
  content: "Starting typing to begin...";
  position: absolute;
  left: 18px;
  top: 12px;
}

@media (min-width: 600px) {
  .placeholder::before {
    @apply text-type-glass text-h2;
    position: absolute;
    content: "Starting typing to begin...";
    left: 18px;
    top: 12px;
  }
}

.soundboard {
  @apply sub;
  margin: 0;
}

@media (min-width: 600px) {
  .soundboard {
    @apply mention;
    margin: 0 0;
  }
}

/*
:deep(.ProseMirror > *) {
  padding: 0 50px 0 68px;
}

:deep(.ProseMirror > *::before) {
  left: 50px;
}
*/
</style>
