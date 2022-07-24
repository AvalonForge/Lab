import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { Extension, findParentNodeClosestToPos } from "@tiptap/core";

/* DEPRECATED */

export const DragHandlePluginKey = new PluginKey("drag-handle");

export default Extension.create({
  name: "DragHandle",
  addProseMirrorPlugins() {
    const editor = this.editor;
    return [
      new Plugin({
        key: DragHandlePluginKey,
        props: {
          decorations(state) {
            const decos: Array<any> = [];
            state.doc.descendants((node, pos) => {
              console.log("from plugin");
              console.log(node);
              if (node.type.name == "paragraph" || node.type.name == "toggle") {
                decos.push(
                  Decoration.widget(0, (view, getPos) => {
                    const handle = document.createElement("div");
                    handle.className = "drag-handle float-left";
                    handle.draggable = true;
                    handle.contentEditable = "false";
                    handle.setAttribute("data-drag-handle", "");
                    handle.setAttribute("disabled", "true");
                    handle.setAttribute("editable", "false");
                    handle.setAttribute("selectable", "false");
                    handle.addEventListener("click", () => {
                      editor
                        .chain()
                        .setNodeSelection(getPos() - 1)
                        .selectParentNode()
                        .run();
                    });
                    return handle;
                  })
                );
              }
            });
            return DecorationSet.create(state.doc, decos);
          },
        },
      }),
    ];
  },
});
