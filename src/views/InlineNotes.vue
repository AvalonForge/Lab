<template lang="html">
  <div class="">
    <div class="flex flex-wrap">
      <h1 class="heading">Avalon Lab Experiment: Inline Notes</h1>
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
