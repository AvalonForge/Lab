<template lang="html">
  <main>
    <Document :getSelectedCommits="getSelectedCommits" ref="doc" />
    <Notes :doc="getDoc" ref="notes" />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Notes from "@/components/document-versions/Notes.vue";
import Document from "@/components/document-versions/Document.vue";

export default defineComponent({
  name: "Document Versions",
  components: {
    Document,
    Notes,
  },
  data() {
    return {
      getDoc: () => {
        //
      },
      getSelectedCommits: () => {
        return [];
      },
    };
  },
  mounted: function () {
    this.getDoc = () => {
      return (this.$refs["doc"] as any).getDoc();
    };
    this.getSelectedCommits = (this.$refs["notes"] as any).getSelectedCommits;
  },
});
</script>

<style lang="css" scoped></style>
