<template lang="html">
  <main >
    <article>
        <editor-content :editor="editor" class="pt-2" :style="{ 'max-width': '60ch' }" />
    </article>
    <aside>
         <h3>Notes</h3>
         Loosely inspired by figma's <strong>Ctrl-G</strong> and <strong>Shift-A</strong>
         Select some text and press <strong>Alt-A</strong> to wrap it into a note.
         <br />
         Drag one note on top of another to set them next to each other <br />
         or... press:
         <button type="button" @click="wrapNote">wrap into note</button>
    </aside>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import Document from "@/components/inline-notes/extensions/document";

import Note from "@/components/inline-notes/extensions/note";
import Collection from "@/components/inline-notes/extensions/collection";

import Paragraph from "@/components/inline-notes/extensions/paragraph";
import Text from "@tiptap/extension-text";
export default defineComponent({
  name: "InlineNotes",
  components: {
    EditorContent,
  },
  data() {
    return {
      editor: null as any,
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

<style lang="css" scoped>
@import "../prosemirror.css";

article >>> section {
    border: 
}

</style>
