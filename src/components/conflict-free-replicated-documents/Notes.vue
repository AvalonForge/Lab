<template lang="html">
  <aside class="">
    <h3>Soundboard</h3>
    <ul class="operations-list">
      <li>
        Sync:
        <select class="" v-model="syncFrom">
          <option :value="''"></option>
          <option
            :key="id"
            v-for="id in ids.filter((id) => id != syncInto)"
            :value="id"
          >
            {{ id }}
          </option>
        </select>
        into:
        <select class="" v-model="syncInto">
          <option :value="''"></option>
          <option
            :key="id"
            v-for="id in ids.filter((id) => id != syncFrom)"
            :value="id"
          >
            {{ id }}
          </option>
        </select>
        <button
          type="button"
          @click="syncFromTo(syncFrom, syncInto)"
          class="flex-none"
        >
          execute
        </button>
      </li>
      <li>
        <ul class="operations-list" v-for="id in ids" :key="id">
          <li class="font-bold border-b border-type">
            {{ id }}
          </li>
          <li>
            <button type="button" @click="logView(id)">log view</button>
          </li>
          <li>
            <button type="button" @click="logClock(id)">
              log clock
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
import { ClockPluginKey, syncFrom, syncInto } from "./clock"

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
  data() {
    return {
      syncFrom: "",
      syncInto: "",
    }
  },
  mounted: function() {
    console.log(this.documents())
  },
  methods: {
    logView: function (id: string) {
      console.log(`${id}:`, this.documents()[id].getView());
    },
    logClock: function(id: string) {
      console.log(`${id}:`, ClockPluginKey.getState(this.documents()[id].getView().state))
    },
    syncFromTo: function() {
      if(this.ids.includes(this.syncFrom) && this.ids.includes(this.syncInto)) {
        const fromState = ClockPluginKey.getState(this.documents()[this.syncFrom].getView().state);
        const intoVector = ClockPluginKey.getState(this.documents()[this.syncInto].getView().state).version;
        const moments = syncFrom(fromState, intoVector)
        syncInto(moments, this.documents()[this.syncInto].getView())
      }

    }
  }
})
</script>

<style lang="css" scoped></style>
