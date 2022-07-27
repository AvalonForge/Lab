<template lang="html">
  <aside class="">
    <h3>Soundboard</h3>
    <ul class="operations-list">
      <li>
        Sync:
        <select class="" v-model="syncA">
          <option :value="''"></option>
          <option
            :key="id"
            v-for="id in ids.filter((id) => id != syncB)"
            :value="id"
          >
            {{ id }}
          </option>
        </select>
        into:
        <select class="" v-model="syncB">
          <option :value="''"></option>
          <option
            :key="id"
            v-for="id in ids.filter((id) => id != syncA)"
            :value="id"
          >
            {{ id }}
          </option>
        </select>
        <button
          type="button"
          @click="sync()"
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
      This a compromise of CRDT and OT architectures.
      The document operaters under prosemirror's model for OTs; normally this would require a central authority to serve as the source of truth.
      We evade this requirement by building document history as a CRDT.
      <br>
      You can think of a doument as the consequence of a timeline of actions.
      To allow users to edit the document without a omnipresent central authority,
      each machine maintains it's own timeline of events.
      The challenge is collapsing these timelines
      <br>
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
import { ClockPluginKey, receiveSync, getSync } from "./clock"

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
      syncA: "",
      syncB: "",
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
    sync: function() {
      this.syncFromTo(this.syncA, this.syncB);
      this.syncFromTo(this.syncB, this.syncA);
      this.syncA = "";
      this.syncB = ""
    },
    syncFromTo: function(syncFrom: string, syncInto: string) {
      if(this.ids.includes(syncFrom) && this.ids.includes(syncInto)) {
        const fromState = ClockPluginKey.getState(this.documents()[syncFrom].getView().state);
        const intoVector = ClockPluginKey.getState(this.documents()[syncInto].getView().state).version;
        const { moments, lastSync } = getSync(fromState, intoVector)
        receiveSync(moments, this.documents()[syncInto].getView(), lastSync)
      }
    }
  }
})
</script>

<style lang="css" scoped></style>
