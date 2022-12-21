<template lang="html">
  <aside>notes</aside>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Notes",
  props: {
    docref: {
      required: true,
    },
  },
  watch: {
    docref: function (value) {
      console.log(value);
    },
  },
});
</script>

<style lang="css" scoped></style>
