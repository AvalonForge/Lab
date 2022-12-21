<template lang="html">
  <main>
    <article class="overflow-hidden flex items-center justify-center">
        <div style="max-width: 100% flex items-center justify-center" class="overflow-hidden">
            <canvas
              :width="artboardSize"
              :height="artboardSize"
              ref="canvas"
            ></canvas>
        </div>
    </article>
    <Notes :canvas="canvas" @update-size="handleUpdateSize"/>
  </main>
</template>

<script lang="ts">
import { defineComponent, nextTick } from "vue";
import Notes from "@/components/perlin-noise/Notes.vue"
export default defineComponent({
  name: "PerlinNoise",
  components: {
    Notes
  },
  data() {
    return {
        canvas: null as any,
        artboardSize: 1280,
    }
  },
  mounted: function() {
    this.canvas = this.$refs["canvas"];
  },
  methods: {
    handleUpdateSize: function(event: number) {
        this.artboardSize = event;
    }
  }
});
/*
  # Notes
  ## How it's generated
  - create a curves by interpolating random points at a certain time interval
  - create a stack of curves (octaves) where each decreases in amplitude and interval
  - 5 points at amplitude 100
  - 10 points at amplitude 10
  - 20 points at amplitude 5
  - ... etc
*/
</script>

<style lang="css" scoped></style>
