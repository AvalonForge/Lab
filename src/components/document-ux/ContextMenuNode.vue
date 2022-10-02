<template lang="html">
  <div class="contextmenu" :style="menu.location">
    {{ menu.search }}
    <div
      :key="item.key"
      v-for="item in menu.items.filter(
        (item) =>
          menu.search.length == 0 ||
          item.key.toLowerCase().search(menu.search) >= 0 ||
          item.title.toLowerCase().search(menu.search) >= 0
      )"
      @click="
        () => {
          menu.run(item.handler);
        }
      "
    >
      {{ item.title }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ContextMenu, MenuItem } from "./contextmenu";
export default defineComponent({
  name: "ContextMenuNode",
  props: {
    menu: {
      type: ContextMenu,
    },
    view: {
      required: true,
    },
  },
  mounted: function () {
    console.log("mounted context menu: ", this.menu);
  },
});
</script>

<style lang="css" scoped>
.contextmenu {
  background-color: var(--paper-color);
}
</style>
