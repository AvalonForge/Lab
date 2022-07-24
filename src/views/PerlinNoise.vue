<template lang="html">
  <div class="">
    <h1 class="heading">Velocity Lab Experiment: Perlin Noise</h1>
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
