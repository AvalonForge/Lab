<template lang="html">
  <main>
    <article class="">
      <ul class="operations-list">
        <li :key="experiment.path" v-for="experiment in experiments">
          <router-link :to="experiment.path"
            >{{ experiment.meta.timestamp }} {{ experiment.name }}</router-link
          >
        </li>
      </ul>
    </article>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Root",
  computed: {
    experiments: function (): Array<any> {
      return this.$router.getRoutes().filter((route) => route.path !== "/");
    },
  },
});
</script>

<style lang="css" scoped>
a {
  @apply text-type;
}
</style>
