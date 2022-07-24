import { Node, mergeAttributes } from "@tiptap/core";
import { Decoration, DecorationSet } from "prosemirror-view";

export default Node.create({
  name: "collection",

  priority: 1000,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      tag: "article",
    };
  },

  group: "collection list",

  content: "note{1,6}",

  parseHTML() {
    return [{ tag: "section" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "article",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  /*
  addKeyboardShortcuts() {
    return {
      "": () => this.editor.commands.setParagraph(),
    };
  },
  */
});
