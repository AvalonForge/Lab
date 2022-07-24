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

<style scoped>
.heading {
  @apply mx-12 text-h3 text-center;
}
.to-velocity {
  @apply mx-12 text-base font-btn;
  text-decoration: none;
}
.editor-padding {
  padding: 0 calc(12px);
}

@media (min-width: 600px) {
  .heading {
    @apply mx-85 text-h1 flex-grow text-left;
  }
  .to-velocity {
    @apply mx-85 text-h3;
  }
  .editor-padding {
    padding: 0 calc(85px - 18px);
  }
}

.caution {
  background-image: url("./assets/caution.svg");
  background-position: center;
  height: 50px;
  width: 100vw;
}
</style>
