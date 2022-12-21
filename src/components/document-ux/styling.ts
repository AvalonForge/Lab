import { Plugin, PluginKey } from "prosemirror-state";
import { Node } from "prosemirror-model";
import schema from "./schema";

export const StylingPluginKey = new PluginKey("styling");

export const styling = new Plugin({
  key: StylingPluginKey,
  state: {
    init: (_, state) => {
      const initStyle = defaultStyles;
      state.doc.descendants(
        (node: Node, pos: number, parent: Node, index: number) => {
          if (node.type == schema.nodes.header) return true;
          if (node.type == schema.nodes.styling) return true;
          if (node.type == schema.nodes.property) {
            console.log("property for node:", node);
            (document.querySelector(".ProseMirror") as any).style.setProperty(
              `--${node.attrs.key}`,
              node.attrs.value
            );
            (initStyle as any)[node.attrs.key] = node.attrs.value;
          }
          return false;
        }
      );
      return initStyle;
    },
    apply: (tr, value) => {
      const effect = tr.getMeta(StylingPluginKey);
      const newState = value;
      if (effect) {
        if (effect.action == "set") {
          (document.querySelector(".ProseMirror") as any).style.setProperty(
            `--${effect.key}`,
            effect.value
          );
          newState.styles[effect.key] = effect.value;
        } else if (effect.action == "remove") {
          (document.querySelector(".ProseMirror") as any).style.removeProperty(
            `---${effect.key}`
          );
          newState.styles[effect.key] = (defaultStyles as any)[effect.key];
        }
      }
      return newState;
    },
  },
});

export default styling;

export interface Effect {
  action: "add" | "remove" | "modify";
  key: string;
  value: string;
}

export const defaultStyles = {
  "root-frequency": "1em",
  ratio: "1.2599",

  "font-family": "Rubik",
  "font-weight": 500,

  /* Headings */
  "title-font-family": "Rubik",
  "heading-font-family": "Rubik",
  "heading-font-weight": 700,

  /* Code */
  "code-font-family": `"JetBrains Mono", monospace`,

  /* Structure */
  "document-width": "60ch",
  margin: "2ch",
};
