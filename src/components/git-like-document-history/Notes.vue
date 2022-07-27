<template lang="html">
  <aside class="">
    <h3>Soundboard</h3>
    <ul class="operations-list">
      <li>
        <button type="button" @click="logDoc">log doc</button>
      </li>
      <li>
        <button type="button" @click="commit" class="flex-none">Commit:</button>
        <input type="text" v-model="message" placeholder="message" />
        Author:
        <input
          type="number"
          v-model="author"
          class="flex-none min-w-0"
          :style="{ 'flex-basis': '4ch' }"
        />
      </li>
    </ul>
    <p class="font-bold">Commits:</p>
    <ul class="operations-list">
      <li :key="i" v-for="(commit, i) in commits">
        <input
          type="checkbox"
          value="false"
          @click="toggleCommit(i)"
          class="flex-none"
        />
        {{ getTimestamp(commit.timestamp) }}
        <p>{{ commit.message }}</p>
        <button type="button" @click="revertTo(i)">revert</button>
      </li>
    </ul>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { VersionPluginKey } from "./versions";
import { Mapping } from "prosemirror-transform";

export default defineComponent({
  name: "Notes",
  props: {
    doc: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      message: "",
      author: 0,
      commits: [],
      selectedCommits: [] as Array<number>,
    };
  },
  methods: {
    logDoc: function () {
      console.log(this.doc());
    },
    commit: function () {
      console.log(this.doc());
      const doc = this.doc();
      const tr = doc.state.tr.setMeta(VersionPluginKey, {
        message: this.message,
        author: this.author,
        timestamp: new Date(),
      });
      doc.dispatch(tr);
      this.message = "";

      this.commits = doc.state["versions$"].commits;
    },
    toggleCommit: function (commit: number) {
      if (this.selectedCommits.includes(commit)) {
        this.selectedCommits.splice(this.selectedCommits.indexOf(commit), 1);
      } else {
        this.selectedCommits.push(commit);
      }
    },
    revertTo: function (index: number) {
      const doc = this.doc();
      const versionState = doc.state["versions$"];
      const commit = versionState.commits[index];
      if (versionState.uncommittedSteps.length)
        return alert("Please commit your changes first!");

      const remap = new Mapping(
        versionState.commits
          .slice(index)
          .reduce((maps: any, c: any) => maps.concat(c.maps), [])
      );

      const tr = doc.state.tr;
      for (let i = commit.steps.length - 1; i >= 0; i--) {
        const remapped = commit.steps[i].map(remap.slice(i + 1));
        if (!remapped) continue;
        const result = tr.maybeStep(remapped);
        if (result.doc) remap.appendMap(remapped.getMap(), i);
      }

      if (tr.docChanged)
        doc.dispatch(
          tr.setMeta(VersionPluginKey, `Revert '${commit.message}'`)
        );
    },

    // Helpers
    getTimestamp: function (time: Date) {
      console.log(time);
      const hours = time.getHours();
      const seconds = time.getSeconds();
      return `${hours < 10 ? "0" : ""}${hours}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
    },
    getSelectedCommits: function () {
      return this.selectedCommits;
    },
  },
});
</script>

<style lang="css" scoped></style>
