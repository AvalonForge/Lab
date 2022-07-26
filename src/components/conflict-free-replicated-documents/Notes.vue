<template lang="html">
  <aside class="">
    <h3>Soundboard</h3>
    <ul class="operations-list">
      <li>
        <ul class="operations-list" v-for="id in ids" :key="id">
          <li class="font-bold border-b border-type">
            {{ id }}
          </li>
          <li>
            <button type="button" @click="logDoc(id)">log doc</button>
          </li>
          <li>
            <button type="button" @click="logView(id)">log view</button>
          </li>
          <li>
            <button type="button" @click="logStateVector(id)">
              log state vector
            </button>
          </li>
        </ul>
      </li>
    </ul>
    <h3>Design Notes</h3>
    <p>
      This isn't actually a true CRDT; It's an OT architecture with some CRDT properties. <br>
      This compormise was made in order to acheive:
      <ul>
        <li>A fully distributed implementation</li>
        <li>A complete document history</li>
        <li>Deterministic conflict resolution</li>
      </ul>
    </p>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
  name: "Notes",
  props: {
    documents: {
      type: Function,
      required: true,
    },
    ids: {
      type: Array,
      required: true,
    }
  },
  mounted: function() {
    console.log(this.documents())
  }
})
</script>

<style lang="css" scoped></style>
