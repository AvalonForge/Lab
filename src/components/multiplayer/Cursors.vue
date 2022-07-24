<template>
  <div class="relative" id="cursor-wrapper">
    <Cursor
      :style="{ 'z-index': '5' }"
      :key="cursor"
      :cursor="cursors[cursor]"
      :anchor="cursors[cursor].pos.anchor"
      :head="cursors[cursor].pos.head"
      :view="view"
      v-for="cursor in Object.keys(cursors).filter(
        (cursor) => cursors[cursor].pos != null
      )"
    />
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { EditorView } from "prosemirror-view";
import Cursor from "./Cursor.vue";

export default defineComponent({
  name: "Cursors",
  components: {
    Cursor,
  },
  props: {
    cursors: {
      type: Array,
      required: true,
    },
    view: {
      type: EditorView,
      required: true,
    },
  },
});
</script>

<style lang="css" scoped></style>
