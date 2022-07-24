<template lang="html">
  <div>
    <h1 class="heading">Welcome to the Avalon Lab</h1>
    <main>
      <ul class="operations-list">
        <li><s>06.14.22 Multiplayer</s></li>
        <li>
          <router-link to="/perlin-noise">06.29.22 Perlin Noise</router-link>
        </li>
        <li>
          <router-link to="/inline-notes">06.24.22 Inline Notes</router-link>
        </li>
        <li><router-link to="/typescale">06.--.22 Typescale</router-link></li>
      </ul>
    </main>
  </div>
</template>

<script>
export default {};
</script>

<style lang="css" scoped>
a {
  @apply text-type;
}
</style>
