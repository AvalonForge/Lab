<template>
  <div
    class="cursor"
    v-if="this.headPos != null && this.anchorPos != null"
    :style="{
      top: anchorPos.top - parentPos.top - 16 + 'px',
      left: anchorPos.left - parentPos.left + 'px',
    }"
  >
    <!-- The cursor flag -->
    <div
      class="ellipsis sub p-mention rounded-mention"
      :style="{ 'background-color': cursor.color }"
    >
      {{ cursor.name }}
    </div>

    <!-- The cursor anchor -->
    <div
      class="absolute"
      :style="{
        width: '2px',
        height: anchorPos.bottom - anchorPos.top + 'px',
        top: 16 + 'px',
        'background-color': cursor.color,
      }"
    ></div>
    <!-- The cursor head -->
    <div
      class="absolute"
      :style="{
        width: '2px',
        height: headPos.bottom - headPos.top + 'px',
        left: headPos.left - anchorPos.left + 'px',
        top: headPos.top - anchorPos.top + 16 + 'px',
        'background-color': cursor.color,
      }"
    ></div>
    <!-- The cursor highlight -->
    <!--
    <div
      class="absolute"
      :style="{
        'background-color': cursor.color,
        opacity: '.3',
        height: height + 'px',
        top: '100%',
        width: width + 'px',
        left: anchorPos.left < headPos.left ? 1 : -1 * width + 'px',
      }"
    ></div>
  --></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { EditorView } from "prosemirror-view";

export default defineComponent({
  name: "Cursor",
  props: {
    cursor: {
      type: Object,
      required: true,
    },
    anchor: {
      type: Number,
      required: true,
    },
    head: {
      type: Number,
      required: true,
    },
    view: {
      type: EditorView,
      required: true,
    },
  },
  computed: {
    parentPos: function (): any {
      return (
        document.querySelector("#cursor-wrapper") as any
      ).getBoundingClientRect();
    },
    width: function (): number {
      return Math.abs(this.anchorPos.left - this.headPos.left);
    },
    height: function (): number {
      return this.anchorPos.top < this.headPos.top
        ? Math.abs(this.headPos.bottom - this.anchorPos.top)
        : Math.abs(this.headPos.top - this.anchorPos.bottom);
    },
    anchorPos: function (): any {
      try {
        const pos = this.view.coordsAtPos(this.anchor);
        if (this.parentPos.left == pos.left) return this.anchorPos;
        return pos;
      } catch (error) {
        console.log("errored");
        return this.anchorPos;
      }
    },
    headPos: function (): any {
      try {
        const pos = this.view.coordsAtPos(this.head);
        return pos;
      } catch (error) {
        console.log("errored");
        return this.headPos;
      }
    },
  },
});
</script>

<style lang="css" scoped>
.cursor {
  position: absolute;
  transition: top, left 0.08s ease-out;
}
</style>
