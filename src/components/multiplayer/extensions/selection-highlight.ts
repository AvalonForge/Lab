import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { Extension } from "@tiptap/core";

export const SelectionHighlightPluginKey = new PluginKey("selection-highlight");

export default Extension.create({
  name: "SelectionHighlight",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: SelectionHighlightPluginKey,
        props: {
          decorations(state) {
            const selection = state.selection;
            const decorations: Array<Decoration> = [];
            if ((selection as any).node && (selection as any).node.isBlock) {
              decorations.push(
                Decoration.node(selection.from, selection.to, {
                  class: "node-selected",
                })
              );
            }
            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});
