<template lang="html">
  <div class="flex">
    <router-link to="/">
      <button type="button" :class="{ active: route == '/' }">index</button>
    </router-link>
    <router-link to="/perlin-noise">
      <button type="button" :class="{ active: route == '/perlin-noise' }">
        live
      </button>
    </router-link>
    <router-link to="/multiplayer">
      <button type="button" :class="{ active: route == '/multiplayer' }">
        multiplayer
      </button>
    </router-link>
    <router-link to="/perlin-noise">
      <button type="button" :class="{ active: route == '/perlin-noise' }">
        perlin noise
      </button>
    </router-link>
    <router-link to="/inline-notes">
      <button type="button" :class="{ active: route == '/inline-notes' }">
        inline notes
      </button>
    </router-link>
    <router-link to="/typescale">
      <button type="button" :class="{ active: route == '/typescale' }">
        typescale
      </button>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Navbar",
  computed: {
    route: function (): string {
      return this.$route.path;
    },
  },
});
</script>

<style lang="css" scoped>
button {
  @apply text-charcoal;
}

.active {
  border-bottom: 0;
  box-shadow: none;
  cursor: default;
}
</style>
