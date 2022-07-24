<template lang="html">
  <div class="">
    <div class="flex flex-wrap">
      <h1 class="heading">Velocity Lab Experiment: Perlin Noise</h1>
      <a
        class="flex items-center btn-primary p-cell rounded-mention to-velocity tracking-heading self-center"
        href="https://www.tryvelocity.xyz"
      >
        Go to velocity
      </a>
    </div>

    <NoiseGenerator class="flex-grow relative mx-page" />
  </div>
</template>

<script lang="ts">
import NoiseGenerator from "@/components/perlin-noise/NoiseGenerator.vue";
export default {
  name: "PerlinNoise",
  components: { NoiseGenerator },
};
</script>

<style lang="css" scoped></style>
