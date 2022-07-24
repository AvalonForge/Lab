<template lang="html">
  <div class="flex gap-50">
    <editor-content :editor="editor" :style="{ width: '60ch' }" />
    <div class="">
      Select some text and press <strong>Alt-A</strong> to wrap it into a note.
      <br />
      Drag one note on top of another to set them next to each other <br />
      or... press:
      <button type="button" @click="wrapNote">wrap into note</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import Document from "./extensions/document";

import Note from "./extensions/note";
import Collection from "./extensions/collection";

import Paragraph from "./extensions/paragraph";
import Text from "@tiptap/extension-text";
export default defineComponent({
  name: "Editor",
  components: {
    EditorContent,
  },
  data() {
    return {
      editor: null as null | Editor,
    };
  },
  created: function () {
    this.editor = new Editor({
      extensions: [Document, Collection, Note, Paragraph, Text],
      content: `
      <p>Testing notes...</p>
      `,
    });
  },
  methods: {
    wrapNote: function () {
      (this.editor as Editor).chain().wrapNote().focus().run();
    },
  },
});
</script>

<style lang="css" scoped></style>
