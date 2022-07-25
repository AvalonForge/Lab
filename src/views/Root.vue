<template lang="html">
  <main>
    <article class="">
      <ul class="operations-list">
        <li><s>06.14.22 Multiplayer</s></li>
        <li>
          <s>06.29.22 Perlin Noise</s>
        </li>
        <li>
          <s to="/inline-notes">06.24.22 Inline Notes</s>
        </li>
        <li>
          <router-link to="/typescale"> 07.18.22 Typescale </router-link>
        </li>
        <li>
          <router-link to="/crdt-documents">
            07.25.22 crdt-documents
          </router-link>
        </li>
      </ul>
    </article>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Root",
});
</script>

<style lang="css" scoped>
a {
  @apply text-type;
}
</style>
