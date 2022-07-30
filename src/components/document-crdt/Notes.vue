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
          v-model="measurements[id]['online']"
          class="flex-none"
        />
        <label class="font-bold">{{ id }}</label>
        <input
          type="checkbox"
          v-model="measurements[id]['passive-pull']"
          class="flex-none"
        />
        <button
          class="text-sm flex-none"
          :class="{ disabled: measurements[id]['passive-pull'] }"
          @click="pull(id)"
        >
          pull
        </button>
        <select
          class="text-sm"
          :ref="`${id}pull`"
          :class="{ disabled: measurements[id]['passive-pull'] }"
        >
          <option :value="''"></option>
          <option
            :key="timeline"
            v-for="timeline in ids.filter((timeline) => timeline != id)"
            :value="timeline"
          >
            {{ timeline }}
          </option>
        </select>
        <input
          type="checkbox"
          v-model="measurements[id]['passive-accept']"
          class="flex-none"
        />
        <button
          class="text-sm flex-none"
          :class="{ disabled: measurements[id]['passive-accept'] }"
        >
          accept
        </button>
        <select
          class="text-sm"
          :class="{ disabled: measurements[id]['passive-accept'] }"
          :ref="`${id}accept`"
        >
          <option :value="''"></option>
          <option
            :key="timeline"
            v-for="timeline in ids.filter((timeline) => timeline != id)"
            :value="timeline"
          >
            {{ timeline }}
          </option>
        </select>
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
        <label>accepted version:</label>
        <div class="">
          {{ measurements[id]["accepted-version"] }}
        </div>
      </li>
      <li>
        <label>*accepted version:</label>
        <div class="">
          {{ measurements[id]["encoded-accepted-version"] }}
        </div>
      </li>
      <li>
        <label>*accepted state:</label>
        <div class="">
          {{ measurements[id]["encoded-accepted-state"] }}
        </div>
      </li>
      <li>
        <label>staged version:</label>
        <div class="">
          {{ measurements[id]["staged-version"] }}
        </div>
      </li>
      <li>
        <label>*staged version:</label>
        <div class="">
          {{ measurements[id]["encoded-staged-version"] }}
        </div>
      </li>
      <li>
        <label>*staged state:</label>
        <div class="">
          {{ measurements[id]["encoded-staged-state"] }}
        </div>
      </li>
      <li>
        <label>global version:</label>
        <div class="">
          {{ measurements[id]["global-version"] }}
        </div>
      </li>
      <li>
        <label>*global version:</label>
        <div class="">
          {{ measurements[id]["encoded-global-version"] }}
        </div>
      </li>
      <li>
        <label>*global state:</label>
        <div class="">
          {{ measurements[id]["encoded-global-state"] }}
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
        Alpha: {
          "global-version": {},
          "encoded-global-version": [],
          "encoded-global-state": [],
          "accepted-version": {},
          "encoded-accepted-version": [],
          "encoded-accepted-state": [],
          "staged-version": {},
          "encoded-staged-version": [],
          "encoded-staged-state": [],

          online: true,

          "passive-pull": true,
          "passive-accept": true, //empty for all
          "passive-accept-from": [],
          "passive-stage": true,
          "passive-state-remote": true,
          "propogate-global-version": false, // when false it will propogate the accepted version
        },
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

      this.measurements[id]["accepted-version"] = version;
      this.measurements[id]["encoded-accepted-version"] = encodedVersion;
      this.measurements[id]["encoded-accepted-state"] = encodedState;
      this.measurements[id]["staged-version"] = version;
      this.measurements[id]["encoded-staged-version"] = encodedVersion;
      this.measurements[id]["encoded-staged-state"] = encodedState;
      this.measurements[id]["global-version"] = version;
      this.measurements[id]["encoded-global-version"] = encodedVersion;
      this.measurements[id]["encoded-global-state"] = encodedState;

      this.measurements[id]["online"] = false;
      this.measurements[id]["passive-pull"] = true;
      this.measurements[id]["passive-accept"] = true;
      this.measurements[id]["passive-accept-from"] = [];
      this.measurements[id]["passive-stage"] = true;
      this.measurements[id]["passive-stage-remote"] = true;
      this.measurements[id]["propogate-remote-version"] = false;
    },
    stage: function (id: string) {
      const doc = this.documents()[id].getDoc();
      this.measurements[id]["staged-version"] = Array.from(
        doc.store.clients.keys()
      ).reduce((clock: any, timeline: any) => {
        return Object.assign(clock, {
          [(this.ids as any)[timeline]]: (
            doc.store.clients.get(timeline) as any
          ).length,
        });
      }, {});
      this.measurements[id]["encoded-staged-version"] =
        Y.encodeStateVector(doc);
      this.measurements[id]["encoded-staged-state"] =
        Y.encodeStateAsUpdate(doc);

      const globalUpdate = Y.diffUpdate(
        this.measurements[id]["encoded-staged-state"],
        this.measurements[id]["encoded-global-version"]
      );

      this.measurements[id]["encoded-global-state"] = Y.mergeUpdates([
        this.measurements[id]["encoded-global-state"],
        globalUpdate,
      ]);

      this.measurements[id]["encoded-global-version"] =
        Y.encodeStateVectorFromUpdate(
          this.measurements[id]["encoded-global-state"]
        );
    },
    pull: function (into: string) {
      const from = (this.$refs[`${into}pull`] as any)[0].value;
      if (this.measurements[from].online) {
        console.log("merging");
        this.measurements[into]["encoded-global-state"] = Y.mergeUpdates([
          this.measurements[into]["encoded-global-state"],
          this.getUpdates(
            from,
            this.measurements[into]["encoded-global-version"]
          ),
        ]);
        this.measurements[into]["encoded-global-version"] =
          Y.encodeStateVectorFromUpdate(
            this.measurements[into]["encoded-global-state"]
          );
        if (this.measurements[into]["passive-accept"]) {
          if (
            this.measurements[into]["passive-accept-from"].includes(from) ||
            this.measurements[into]["passive-accept-from"].length == 0
          ) {
            Y.applyUpdate(
              this.documents()[into].getDoc(),
              this.getUpdates(
                from,
                this.measurements[into]["encoded-accepted-version"]
              )
            );
          }
        }
        if (this.measurements[into]["passive-stage-remote"]) {
          this.measurements[into]["encoded-staged-state"] = Y.mergeUpdates([
            this.measurements[into]["encoded-staged-state"],
            this.getUpdates(
              from,
              this.measurements[into]["encoded-staged-version"]
            ),
          ]);
          this.measurements[into]["encoded-staged-verion"] =
            Y.encodeStateVectorFromUpdate(
              this.measurements[into]["encoded-staged-state"]
            );
        }
      }
    },
    getUpdates: function (from: string, version: Uint8Array): Uint8Array {
      if (this.measurements[from].online) {
        if (this.measurements[from]["propogate-global-version"]) {
          return Y.diffUpdate(
            this.measurements[from]["encoded-global-state"],
            version
          );
        } else {
          return Y.diffUpdate(
            this.measurements[from]["encoded-staged-state"],
            version
          );
        }
      }
      throw "The document is not online";
    },

    /* Setters */
    measure: function (id: string, doc: any) {
      // Accepted
      this.measurements[id]["accepted-version"] = Array.from(
        doc.store.clients.keys()
      ).reduce((clock: any, timeline: any) => {
        return Object.assign(clock, {
          [(this.ids as any)[timeline]]: (
            doc.store.clients.get(timeline) as any
          ).length,
        });
      }, {});
      this.measurements[id]["encoded-accepted-version"] =
        Y.encodeStateVector(doc);
      this.measurements[id]["encoded-accepted-state"] =
        Y.encodeStateAsUpdate(doc);

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
