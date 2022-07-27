<template lang="html">
  <aside class="">
    <h3>Soundboard</h3>
    <ul class="operations-list">
      <li class="flex gap-4">
        Pull from:
        <select class="" v-model="pullFrom">
          <option :value="''"></option>
          <option
            :key="id"
            v-for="id in ids.filter((id) => id != pullInto)"
            :value="id"
          >
            {{ id }}
          </option>
        </select>
        into:
        <select class="" v-model="pullInto">
          <option :value="''"></option>
          <option
            :key="id"
            v-for="id in ids.filter((id) => id != pullFrom)"
            :value="id"
          >
            {{ id }}
          </option>
        </select>
        <button
          type="button"
          @click="pullFromTo(pullFrom, pullInto)"
          class="flex-none"
        >
          execute
        </button>
      </li>
      <li class="">
        <ul class="operations-list flex-grow" v-for="id in ids" :key="id">
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
          <li>
            <button type="button" @click="renderHistory(id)">
              render history
            </button>
          </li>
        </ul>
      </li>
      <li>
        <ul class="operations-list flex-grow" v-for="id in ids" :key="id">
          <li :key="i" v-for="(event, i) in history[id]">{{ event }}</li>
        </ul>
      </li>
    </ul>

    <h3>Notes</h3>
    <p>
      This is a test of the Y-js Xml CRDT as a solution for a distributed
      document system.
    </p>
    <p>
      <strong>Characteristics:</strong>
    </p>
    <ul>
      <li>Changes in arbitrary order must merge to the same result</li>
      <li>Merged changes must preserve intention</li>
      <li>Documents will propogate all known changes, regardless of source</li>
    </ul>
    <p><strong>The result should be:</strong></p>
    <ul>
      <li>Accessible regarless to downtime, poor connection, & censorship</li>
      <li>Simply mutable... merging is invisible to users (unlike git)</li>
      <li>Exponentially stronger at scale</li>
    </ul>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import * as Y from "yjs";

const ids = ["Alpha", "Bravo", "Charlie"] as any;

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
    },
  },
  data() {
    return {
      pullFrom: "",
      pullInto: "",
      history: {
        Alpha: [] as any,
        Bravo: [] as any,
        Charlie: [] as any,
      } as any,
    };
  },
  methods: {
    /* Document */
    logDoc: function (id: string) {
      console.log(`${id}:`, this.documents()[id].getDoc());
    },
    logView: function (id: string) {
      console.log(`${id}:`, this.documents()[id].getView());
    },
    logStateVector: function (id: string) {
      console.log(`${id}:`, Y.encodeStateVector(this.documents()[id].getDoc()));
    },
    renderHistory: function (id: string) {
      console.log(this.documents()[id].getDoc());
      this.history[id] = [];
      const clients = this.documents()[id].getDoc().store.clients;
      clients.forEach((client: any) => {
        client.forEach((value: any) => {
          console.log(value);
          this.history[id].push(`${ids[value.id.client]}: ${value.id.clock}`);
        });
      });
    },

    /* Global */
    pullFromTo: function (from: string, to: string) {
      console.log(`Pulling from ${from} into ${to}`);

      const fromDoc = this.documents()[from].getDoc();
      const toDoc = this.documents()[to].getDoc();

      const fromVector = Y.encodeStateVector(fromDoc);
      const toVector = Y.encodeStateVector(this.documents()[to].getDoc());

      const diff = Y.encodeStateAsUpdate(fromDoc, toVector);

      Y.applyUpdate(toDoc, diff);
    },
  },
});
</script>

<style lang="css" scoped></style>
