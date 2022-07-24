<template lang="html">
  <div class="">
    <div class="flex flex-wrap">
      <h1 class="heading">Velocity Lab Experiment: Typescale</h1>
      <a
        class="flex items-center btn-primary p-cell rounded-mention to-velocity tracking-heading self-center"
        href="https://www.tryvelocity.xyz"
      >
        Go to velocity
      </a>
    </div>

    <DisplayCase class="flex-grow relative mx-page" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DisplayCase from "@/components/typescale/DisplayCase.vue";
export default defineComponent({
  name: "Typescale",
  components: {
    DisplayCase,
  },
});
</script>

<style lang="css" scoped></style>
