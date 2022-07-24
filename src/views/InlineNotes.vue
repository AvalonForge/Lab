<template lang="html">
  <div class="">
    <div class="flex flex-wrap">
      <h1 class="heading">Avalon Lab Experiment: Inline Notes</h1>
      <a
        class="flex items-center btn-primary p-cell rounded-mention to-velocity tracking-heading self-center"
        href="https://www.tryvelocity.xyz"
      >
        Go to velocity
      </a>
    </div>

    <Editor class="flex-grow relative mx-page" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Editor from "@/components/inline-notes/Editor.vue";
export default defineComponent({
  name: "InlineNotes",
  components: {
    Editor,
  },
});
</script>

<style lang="css" scoped></style>
