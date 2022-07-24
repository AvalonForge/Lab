<template lang="html">
  <div id="lab">
    <Navbar />
    <h1 class="mx-8">{{ title }}</h1>
    <router-view />
    <div class="text-h1 mt-after" :class="{ dev: dev }">
      <div class="in-dev">IN DEVELOPMENT</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "@/components/Navbar.vue";
export default defineComponent({
  name: "App",
  components: {
    Navbar,
  },
  computed: {
    title: function () {
      if (this.$route.path == "/") {
        return "Welcome to the Avalon Lab";
      } else {
        return `Avalon Labs Experiment: ${this.$route.path.replace(/\//, "")}`;
      }
    },
    dev: function () {
      return this.$route.meta["dev"];
    },
  },
});
</script>

<style scoped>
.dev {
  @apply flex justify-center items-center bg-avalon;
  flex-shrink: 0;
  height: 85px;
  background-image: url("./assets/caution.svg");
  background-position: center;
}

.in-dev {
  @apply font-bold text-h1 bg-avalon px-4;
  letter-spacing: 0.35rem;
  display: none;
}

.dev .in-dev {
  display: inline-block;
}
</style>
