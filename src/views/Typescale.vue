<template lang="html">
  <main>
    <Document id="typescale-document" />
    <Notes :documents="documents" :ids="ids" />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Document from "@/components/typescale/Document.vue";
import Notes from "@/components/typescale/Notes.vue";
export default defineComponent({
  name: "Typescale",
  components: {
    Document,
    Notes,
  },
});
</script>

<style lang="css" scoped></style>
