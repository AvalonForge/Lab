<template lang="html">
  <aside class="">
    <h3>Notes</h3>
    <p>A lil example doc to help pick a typescale when starting a project.</p>
    <ul class="operations-list">
        <li>
            <div>root:</div> <input type="number" v-model="f"/>
        </li>
        <li>
            <div>ratio:</div> <input type="number" v-model="r"/>
        </li>
        <li>
            <div>paragraph spacing:</div> <input type="number" v-model="m"/>
        </li>
        <li>
            <div>indent:</div> <input type="number" v-model="indent"/>
        </li>
    </ul>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: "Notes",
    data() {
        return {
            f: 16,
            r: 2,
            m: 2,
            indent: 1,
        }
    },
    mounted: function() {
        this.setScale();
    },
    watch: {
        f: function() { this.setScale() },
        r: function() { this.setScale() },
        m: function() { this.setScale() },
        indent: function() { this.setScale() },
    },
    methods: {
        setScale: function() {
            const el = document.querySelector("#typescale-document");
            el.style.setProperty("--base", `${this.f}px`);
            el.style.setProperty("--h1", `${this.f * this.r}px`);
            el.style.setProperty("--h2", `${this.f * Math.pow(this.r, 2/3)}px`);
            el.style.setProperty("--h3", `${this.f * Math.pow(this.r, 1/3)}px`);
            el.style.setProperty("--m-top", `${this.f * this.m}px`);
            el.style.setProperty("--m-bottom", `${this.f * this.m / this.r}px`);
            el.style.setProperty("--indent", `${this.f * this.indent}px`);
        }
    }
})
</script>

<style lang="css" scoped></style>
