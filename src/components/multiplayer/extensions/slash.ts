import { Plugin, PluginKey, NodeSelection } from "prosemirror-state";
//import { EditorView } from "prosemirror-view";

import { Extension } from "@tiptap/core";

export const SlashPluginKey = new PluginKey("slash");

export default Extension.create({
  addOptions() {
    return {
      openMenu: null,
    };
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: SlashPluginKey,
        props: {
          handleKeyPress: (view, event) => {
            if (event.key == "/") {
              this.options.openMenu();
            }
            return false;
          },
        },
      }),
    ];
  },
});
