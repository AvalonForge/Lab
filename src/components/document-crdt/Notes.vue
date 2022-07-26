<template lang="html">
  <aside class="">
    <h3>Notes</h3>
    <p>
      This is a test of an XML CRDT integration with prosemirror for a fully P2P
      document system. The goal is to achieve the benefits of a P2P
      relationship, such as offline editing, security, and ownership, without
      sacrificing the uptime of a client-server relationship.
    </p>
    <p>
      <strong>Characteristics:</strong>
    </p>
    <ul>
      <li>Changes in arbitrary order merge to the same result</li>
      <li>Merged changes preserve intention</li>
      <li>Changes can reasonably expect to propagate across the network</li>
    </ul>

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
          <li>
            <button type="button" @click="logSnapshot(id)">log snapshot</button>
          </li>
        </ul>
      </li>
    </ul>

    <h3 class="relative">Alpha Snapshot</h3>
    <ul class="operations-list">
      <li :style="{ 'align-items': 'start' }">
        <ul
          class="operations-list"
          v-if="
            measurements['Alpha']['clock'] &&
            measurements['Alpha']['clock'].keys
          "
        >
          <li class="font-bold">clock</li>
          <li
            :key="timeline"
            v-for="timeline in measurements['Alpha']['clock'].keys()"
          >
            {{ timeline }} =>
            {{ measurements["Alpha"]["snapshot-clock"].get(timeline) }}
            <input
              type="range"
              :style="{ 'min-width': '0px' }"
              :min="0"
              :max="measurements['Alpha']['clock'].get(timeline)"
              :value="measurements['Alpha']['snapshot-clock'].get(timeline)"
              @input="
                (event) => {
                  measurements['Alpha']['snapshot-clock'].set(
                    timeline,
                    event.target.value
                  );
                  renderPruning();
                }
              "
            />
          </li>
        </ul>
        <ul
          class="operations-list overflow-auto"
          :style="{ 'max-height': '180px' }"
          v-if="
            measurements['Alpha']['delete-set'] &&
            measurements['Alpha']['delete-set'].clients
          "
        >
          <li class="font-bold">delete set</li>
          <div
            :key="client"
            v-for="client in Array.from(
              measurements['Alpha']['delete-set'].clients.keys()
            )"
          >
            <li
              :key="item.clock"
              v-for="(item, i) in measurements['Alpha'][
                'delete-set'
              ].clients.get(client)"
            >
              <input
                type="checkbox"
                v-model="
                  measurements['Alpha']['snapshot-delete-set'][client][i]
                "
                class="flex-none"
                @change="renderPruning()"
              />
              {{ client }} => { {{ item.clock }}: {{ item.len }} }
            </li>
          </div>
        </ul>
      </li>
    </ul>
    <div class="" ref="snapshot"></div>

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
  </aside>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import * as Y from "yjs";
import { yDocToProsemirror } from "y-prosemirror";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import schema from "../prosemirror/schema";

import { SyncPluginKey } from "./sync";
import { getStateVector } from "./helpers";

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
      versionRender: null as any,
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
    logSnapshot: function (id: string) {
      console.log(`${id}:`, Y.snapshot(this.documents()[id].getDoc()));
    },
    renderPruning: function () {
      const filteredDeleteSet = { clients: new Map() };
      Array.from(
        this.measurements["Alpha"]["delete-set"].clients.keys()
      ).forEach((client) => {
        filteredDeleteSet.clients.set(
          client,
          this.measurements["Alpha"]["delete-set"].clients
            .get(client)
            .filter(
              (item: any, i: number) =>
                this.measurements["Alpha"]["snapshot-delete-set"][
                  client as any
                ][i]
            )
        );
      });
      const snapshot = new Y.Snapshot(
        filteredDeleteSet,
        this.measurements["Alpha"]["snapshot-clock"]
      );
      //console.log(snapshot);
      if (
        Array.from(snapshot.sv).reduce(
          (acc, client) => acc && client[1] > 0,
          true
        )
      ) {
        const doc = Y.createDocFromSnapshot(
          this.documents()["Alpha"].getDoc(),
          snapshot
        );
        if (this.versionRender != null) this.versionRender.destroy();
        const rendering = yDocToProsemirror(schema, doc);
        //console.log(rendering);

        const state = EditorState.create({ schema: schema, doc: rendering });
        this.versionRender = new EditorView(this.$refs["snapshot"] as any, {
          state,
          plugins: [
            new Plugin({
              props: {
                editable: () => {
                  return false;
                },
              },
            }),
          ],
        });
      }
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

      this.measurements[id]["clock"] = getStateVector(doc.store);
      this.measurements[id]["snapshot-clock"] = getStateVector(doc.store);
      this.measurements[id]["delete-set"] = Y.createDeleteSetFromStructStore(
        doc.store
      );
      this.measurements[id]["snapshot-delete-set"] =
        Y.createDeleteSetFromStructStore(doc.store);
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
              this.measurements[id]["acknowledged-version"]
            )
          );
        });
    },
    send: function (id: string) {
      console.log("sending");
      this.ids
        .filter((peer: any) => this.measurements[peer].online && peer != id)
        .forEach((peer: any) => {
          this.applySync(
            peer,
            this.getSync(
              id,
              peer,
              this.measurements[peer]["acknowledged-version"]
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
      // State
      const oldVersion = this.measurements[id]["*current-version"];
      this.measurements[id]["*current-version"] = Array.from(
        doc.store.clients.keys()
      ).reduce((clock: any, timeline: any) => {
        return Object.assign(clock, {
          [(this.ids as any)[timeline]]: (
            doc.store.clients.get(timeline) as any
          ).length,
        });
      }, {});
      console.log(
        !Object.keys(this.measurements[id]["*current-version"]).reduce(
          (acc, key) =>
            acc &&
            oldVersion[key] == this.measurements[id]["*current-version"][key],
          true
        )
      );
      if (
        !Object.keys(this.measurements[id]["*current-version"]).reduce(
          (acc, key) =>
            acc &&
            oldVersion[key] == this.measurements[id]["*current-version"][key],
          true
        )
      ) {
        this.measurements[id]["current-version"] = Y.encodeStateVector(doc);
        this.measurements[id]["current-state"] = Y.encodeStateAsUpdate(doc);

        // Staging
        if (this.measurements[id]["passive-stage"]) this.stage(id);

        // Clock

        this.measurements[id]["clock"] = getStateVector(doc.store);
        this.measurements[id]["snapshot-clock"] = getStateVector(doc.store);
        this.measurements[id]["delete-set"] = Y.createDeleteSetFromStructStore(
          doc.store
        );
        this.measurements[id]["snapshot-delete-set"] = Array.from(
          this.measurements[id]["delete-set"].clients.keys()
        ).map((key: any) => {
          const timeline = this.measurements[id]["delete-set"].clients.get(key);
          return timeline.map((item: any) => true);
        });
        if (id == "Alpha") this.renderPruning();
        if (
          this.measurements[id]["online"] &&
          this.measurements[id]["passive-stage"]
        )
          this.send(id);
      }
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
