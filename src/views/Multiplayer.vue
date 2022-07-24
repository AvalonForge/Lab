<template lang="html">
  <div class="">
    <div class="flex flex-wrap">
      <h1 class="heading">Velocity Lab Experiment: Multiplayer</h1>
      <a
        class="flex items-center btn-primary p-cell rounded-mention to-velocity tracking-heading self-center"
        href="https://www.tryvelocity.xyz"
      >
        Go to velocity
      </a>
    </div>

    <Editor class="flex-grow relative editor-padding" />
  </div>
</template>

<script lang="ts">
import Editor from "@/components/multiplayer/Editor.vue";

export default {
  name: "Multiplayer",
  components: {
    Editor,
  },
};
</script>

<style scoped></style>
