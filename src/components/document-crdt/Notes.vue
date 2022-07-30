<template lang="html">
  <aside class="">
    <h3>Soundboard</h3>
    <ul class="operations-list">
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
        </ul>
      </li>
    </ul>

    <h3>States:</h3>
    <ul class="operations-list flex-grow" v-for="id in ids" :key="id">
      <li class="border-b border-type">
        <input
          type="checkbox"
          value="measurements[id]['online']"
          @click="toggleOnline(id)"
          class="flex-none"
        />
        <label class="font-bold">{{ id }}</label>
        <input
          type="checkbox"
          v-model="measurements[id]['passive-pull']"
          class="flex-none"
        />
        <button
          class="text-sm"
          :class="{ disabled: measurements[id]['passive-pull'] }"
          @click="pull(id)"
        >
          pull
        </button>
        <input
          type="checkbox"
          v-model="measurements[id]['passive-stage']"
          class="flex-none"
        />
        <button
          class="text-sm"
          :class="{ disabled: measurements[id]['passive-stage'] }"
          @click="stage(id)"
        >
          stage
        </button>
      </li>
      <li>
        <label>*current version:</label>
        <div class="">
          {{ measurements[id]["*current-version"] }}
        </div>
      </li>
      <li>
        <label>current version:</label>
        <div class="">
          {{ measurements[id]["current-version"] }}
        </div>
      </li>
      <li>
        <label>current state:</label>
        <div class="">
          {{ measurements[id]["current-state"] }}
        </div>
      </li>
      <li>
        <label>accepted version:</label>
        <div class="">
          {{ measurements[id]["accepted-version"] }}
        </div>
      </li>
      <li>
        <label>acknowledged version:</label>
        <div class="">
          {{ measurements[id]["acknowledged-version"] }}
        </div>
      </li>
      <li>
        <label>acknowledged state:</label>
        <div class="">
          {{ measurements[id]["acknowledged-state"] }}
        </div>
      </li>
    </ul>

    <h3>Notes</h3>
    <p>This is a live test of a Xml based CRDT integration with prosemirror.</p>
    <p>
      <strong>Characteristics:</strong>
    </p>
    <ul>
      <li>Changes in arbitrary order merge to the same result</li>
      <li>Merged changes preserve intention</li>
      <li>Documents can propogate all known changes, regardless of source</li>
      <li>Documents can programmatically accept / reject changes</li>
    </ul>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import * as Y from "yjs";

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
      measurements: {
        Alpha: {},
        Bravo: {},
        Charlie: {},
        Delta: {},
        Echo: {},
      } as any,
    };
  },
  mounted: function () {
    this.ids.forEach((id: any) => {
      this.init(id);
    });
  },
  methods: {
    /* Logging */
    logDoc: function (id: string) {
      console.log(`${id}:`, this.documents()[id].getDoc());
    },
    logView: function (id: string) {
      console.log(`${id}:`, this.documents()[id].getView());
    },

    /* State */
    init: function (id: string) {
      const doc = this.documents()[id].getDoc();
      const version = Array.from(doc.store.clients.keys()).reduce(
        (clock: any, timeline: any) => {
          return Object.assign(clock, {
            [(this.ids as any)[timeline]]: (
              doc.store.clients.get(timeline) as any
            ).length,
          });
        },
        {}
      );
      const encodedVersion = Y.encodeStateVector(doc);
      const encodedState = Y.encodeStateAsUpdate(doc);

      this.measurements[id]["*current-version"] = version;
      this.measurements[id]["current-version"] = encodedVersion;
      this.measurements[id]["current-state"] = encodedState;
      this.measurements[id]["accepted-version"] = encodedVersion;
      this.measurements[id]["accepted-state"] = encodedState;
      this.measurements[id]["acknowledged-version"] = encodedVersion;
      this.measurements[id]["acknowledged-state"] = encodedState;

      this.measurements[id]["online"] = false;
      this.measurements[id]["passive-pull"] = true;
      this.measurements[id]["passive-stage"] = true;
    },
    stage: function (id: string) {
      const doc = this.documents()[id].getDoc();
      this.measurements[id]["accepted-version"] = Y.encodeStateVector(doc);
      this.measurements[id]["accepted-state"] = Y.encodeStateAsUpdate(doc);

      const update = Y.diffUpdate(
        this.measurements[id]["accepted-state"],
        this.measurements[id]["acknowledged-version"]
      );

      this.measurements[id]["acknowledged-state"] = Y.mergeUpdates([
        this.measurements[id]["acknowledged-state"],
        update,
      ]);

      this.measurements[id]["acknowledged-version"] =
        Y.encodeStateVectorFromUpdate(
          this.measurements[id]["acknowledged-state"]
        );
    },
    pull: function (into: string) {
      const updateCurrent = Y.diffUpdate(
        this.measurements[into]["acknowledged-state"],
        this.measurements[into]["current-version"]
      );
      const updateAccepted = Y.diffUpdate(
        this.measurements[into]["acknowledged-state"],
        this.measurements[into]["accepted-version"]
      );

      Y.applyUpdate(this.documents()[into].getDoc(), updateCurrent);
      this.measurements[into]["accepted-state"] = Y.mergeUpdates([
        this.measurements[into]["accepted-state"],
        updateAccepted,
      ]);
      this.measurements[into]["accepted-version"] =
        Y.encodeStateVectorFromUpdate(
          this.measurements[into]["accepted-state"]
        );

      if (this.measurements[into]["passive-stage"]) this.stage(into);
    },
    toggleOnline: function (id: string) {
      this.measurements[id]["online"] ? this.disconnect(id) : this.connect(id);
    },
    connect: function (id: string) {
      this.measurements[id]["online"] = true;
      this.ids
        .filter((peer: any) => this.measurements[peer].online && peer != id)
        .forEach((peer: any) => {
          this.applySync(
            id,
            this.getSync(
              peer,
              id,
              this.measurements[id]["acknowledged-version"],
              false
            )
          );
        });
    },
    disconnect: function (id: string) {
      this.measurements[id]["online"] = false;
    },
    getSync: function (
      from: string, // me
      into: string, // the one requesting
      version: Uint8Array, // the version of the one requesting
      confirmation = true
    ): Uint8Array {
      console.log(
        "getting sync from ",
        from,
        " for ",
        into,
        " at version ",
        version
      );
      setTimeout(() => {
        if (!confirmation) {
          console.log(
            "need to update myself",
            this.measurements[from]["acknowledged-version"],
            version
          );
          this.applySync(
            from,
            this.getSync(
              into,
              from,
              this.measurements[from]["acknowledged-version"]
            )
          );
        }
      }, 0);

      return Y.diffUpdate(this.measurements[from]["accepted-state"], version);
    },
    applySync: function (into: string, update: Uint8Array) {
      console.log(
        "applying update",
        update,
        " to state ",
        this.measurements[into]["acknowledged-state"]
      );
      this.measurements[into]["acknowledged-state"] = Y.mergeUpdates([
        this.measurements[into]["acknowledged-state"],
        update,
      ]);
      this.measurements[into]["acknowledged-version"] =
        Y.encodeStateVectorFromUpdate(
          this.measurements[into]["acknowledged-state"]
        );
      if (this.measurements[into]["passive-pull"]) this.pull(into);
    },

    /* Setters */
    measure: function (id: string, doc: any) {
      // Accepted
      this.measurements[id]["*current-version"] = Array.from(
        doc.store.clients.keys()
      ).reduce((clock: any, timeline: any) => {
        return Object.assign(clock, {
          [(this.ids as any)[timeline]]: (
            doc.store.clients.get(timeline) as any
          ).length,
        });
      }, {});
      this.measurements[id]["current-version"] = Y.encodeStateVector(doc);
      this.measurements[id]["current-state"] = Y.encodeStateAsUpdate(doc);

      //Staging
      if (this.measurements[id]["passive-stage"]) this.stage(id);
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

<style lang="css" scoped>
.operations-list li > div {
  @apply whitespace-nowrap overflow-scroll;
}
</style>
