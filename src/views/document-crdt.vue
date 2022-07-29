<template lang="html">
  <main>
    <article class="">
      <Document :azimuth="id" :ref="id" :key="id" v-for="id in ids" />
    </article>
    <Notes :documents="documents" :ids="ids" />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Notes from "@/components/document-crdt/Notes.vue";
import Document from "@/components/document-crdt/Document.vue";

export default defineComponent({
  name: "Reverse Engineering Yjs",
  components: {
    Document,
    Notes,
  },
  data() {
    return {
      ids: ["Alpha", "Bravo", "Charlie"],
    };
  },
  methods: {
    documents: function () {
      const docs = {} as any;
      this.ids.forEach((id: string) => {
        docs[id] = (this.$refs[id] as any)[0];
      });
      return docs;
    },
  },
});
</script>

<style lang="css" scoped></style>
