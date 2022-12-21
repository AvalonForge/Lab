<template lang="html">
  <div class="">
    <h2>Atoms</h2>
    <h3>Patp</h3>
    <address>~zod</address>
    <h3>Time</h3>
    <time>some time</time>
    <h3>Text</h3>
    <p>inline text</p>
    <h2>Molecules</h2>
    <h3>Paragraph</h3>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </p>
    <h3>Blockquote</h3>
    <blockquote cite="ames://~dalsyr-diglyn">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <cite href="ames://~dalsyr-diglyn.engram">
        <address>~dalsyr-diglyn</address>
        <time>10/16/22</time>
      </cite>
    </blockquote>
    <h3>Heading</h3>
    <ul>
      <li>level: 1 | 2 | 3 | 4 | 5 | 6</li>
    </ul>
    <h1>heading</h1>
    <h3>Horizontal Rule</h3>
    <hr />
    <h3>List</h3>
    <ul>
      <li>style: unordered | ordered</li>
      <li>order: number</li>
    </ul>
    <ul>
      <li></li>
      <li></li>
    </ul>
    <h3>Code Snippet</h3>
    <pre></pre>
    <h3>Embed</h3>
    <figure>
      <img src="" alt="" />
      <figcaption>cap</figcaption>
    </figure>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Molecules",
});
</script>

<style lang="css" scoped></style>
