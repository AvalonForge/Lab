<template lang="html">
  <div class="">
    <h1>Avalon Lab Experiment: Guerilla Documents</h1>
    <main>
      <article class="">
        <Document :azimuth="id" :ref="id" :key="id" v-for="id in ids" />
      </article>
      <Notes :documents="documents" :ids="ids" />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Notes from "@/components/guerilla-documents/Notes.vue";
import Document from "@/components/guerilla-documents/Document.vue";

export default defineComponent({
  name: "Guerilla Documents",
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
