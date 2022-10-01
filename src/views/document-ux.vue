<template lang="html">
  <main>
    <Document ref="doc" />
    <Notes :docref="$refs['doc']" />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Document from "@/components/document-ux/Document.vue";
import Notes from "@/components/document-ux/Notes.vue";

export default defineComponent({
  name: "Document UX",
  components: {
    Document,
    Notes,
  },
});
</script>

<style lang="css" scoped>
@import "../components/document-ux/theme.css";

main {
  background-color: var(--window-color);
}
</style>
