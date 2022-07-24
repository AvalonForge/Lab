import { Node, mergeAttributes } from "@tiptap/core";
import { Decoration, DecorationSet } from "prosemirror-view";

export interface ParagraphOptions {
  HTMLAttributes: Record<string, any>;
  tag: "div" | "p";
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    paragraph: {
      /**
       * Toggle a paragraph
       */
      setParagraph: () => ReturnType;
    };
  }
}

export default Node.create<ParagraphOptions>({
  name: "paragraph",

  priority: 1000,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      tag: "p",
    };
  },

  group: "block",

  content: "inline*",

  parseHTML() {
    return [{ tag: this.options.tag }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      this.options.tag,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setParagraph:
        () =>
        ({ commands }) => {
          return commands.setNode(this.name);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Alt-0": () => this.editor.commands.setParagraph(),
    };
  },
});
