<template lang="html">
  <div class="">
    <Navbar />
    <router-view />
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
});
</script>

<style scoped></style>
