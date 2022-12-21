<template lang="html">
  <main>
    <article class="">
      <Molecules />
    </article>
    <aside class=""></aside>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Molecules from "@/components/atomic-ux/Molecules.vue";
export default defineComponent({
  name: "Atomic UX",
  components: {
    Molecules,
  },
});
</script>

<style lang="css" scoped></style>
