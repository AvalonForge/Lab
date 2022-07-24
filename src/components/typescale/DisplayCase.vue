<template lang="html">
  <div class="flex gap-50">
    <div
      class="font-sans overflow-auto scrollbar-sm"
      :style="{ width: '60ch', 'max-height': '80vh' }"
    >
      <h1>Heading 1</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam id enim
        non dolor hendrerit tristique a in risus. Sed felis quam, fermentum sed
        porttitor ac, scelerisque rutrum magna. Nam non cursus ligula.
      </p>
      <h2>Heading 2</h2>
      <p>
        Integer fringilla aliquet rhoncus. Phasellus ornare rhoncus vestibulum.
        Aenean dapibus lectus viverra nibh venenatis, non suscipit lacus
        pharetra. Donec molestie condimentum justo, eu convallis lacus sodales
        ut. Phasellus auctor id purus sed aliquam.
      </p>
      <p>
        Praesent viverra magna vitae lacus tempor imperdiet. Suspendisse
        hendrerit, quam non aliquam euismod, tellus mi euismod arcu, quis
        bibendum nisl sem eget neque. Fusce ut ante rutrum, dapibus nisl ut,
        feugiat purus.
      </p>
      <h3>Heading 3</h3>
      <p>
        Pellentesque consectetur massa sed risus dapibus scelerisque. Ut auctor,
        elit id placerat volutpat, mi metus aliquam purus, sed hendrerit ipsum
        nibh sed est. Nullam felis lorem, lacinia non consectetur id,
        consectetur a lectus.
      </p>
      <ul>
        <li>Ut pellentesque</li>
        <li>leo euismod</li>
        <li>varius quam id</li>
        <li>dictum nisl</li>
      </ul>
      <p>
        Fusce vitae mauris suscipit, <strong>eleifend ex eu</strong>, ornare
        nulla. Nulla maximus vehicula urna at commodo. Suspendisse eu
        scelerisque massa.
      </p>
      <blockquote>
        Nunc a tincidunt metus. Vestibulum ante ipsum primis in faucibus orci
        luctus et ultrices posuere cubilia curae; Aenean interdum urna sodales
        odio pharetra blandit. Fusce eget luctus est. Nunc vel mollis ante.
        Vivamus pretium blandit fringilla. Aenean et massa urna. Phasellus ac
        nunc tortor. Morbi nec leo non turpis ultrices commodo. Nam quam eros,
        dictum eget consequat eget, mattis vitae lacus. In vestibulum lorem
        magna, eu gravida tellus malesuada sed. Vestibulum maximus at nunc vel
        eleifend.
      </blockquote>
      <p>
        In vitae magna orci. Vivamus in nulla quis leo commodo bibendum id vitae
        risus. Nam at dolor rhoncus, venenatis nunc non, placerat sem. Phasellus
        malesuada luctus nunc nec dignissim.
      </p>
    </div>
    <div class="">lol tbh I'm pretty happy with this as is</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DisplayCase",
});
</script>

<style lang="css" scoped></style>
