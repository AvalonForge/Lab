<template lang="html">
  <nav>
    <router-link to="/">
      <button type="button" :class="{ active: route == '/' }">index</button>
    </router-link>
    <router-link :to="live">
      <button type="button" :class="{ active: route == live }">live</button>
    </router-link>
    <router-link :to="`/${path}`" :key="path" v-for="path in experiments">
      <button type="button" :class="{ active: route == `/${path}` }">
        {{ path }}
      </button>
    </router-link>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Navbar",
  data() {
    return {
      live: "",
    };
  },
  mounted: function () {
    this.$router.getRoutes().forEach((route) => {
      if (route.meta.live) this.live = route.path;
    });
  },
  computed: {
    route: function (): string {
      return this.$route.path;
    },
    experiments: function (): Array<string> {
      return this.$router
        .getRoutes()
        .filter((route) => route.meta.hidden !== true)
        .map((route) => route.path.replace(/\//, ""))
        .filter((route: string) => route);
    },
  },
});
</script>

<style lang="css" scoped>
button {
  @apply text-type;
}

.active {
  border-bottom: 0;
  box-shadow: none;
  cursor: default;
}
</style>
