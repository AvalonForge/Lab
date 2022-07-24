import { Node, mergeAttributes } from "@tiptap/core";
import { Decoration, DecorationSet } from "prosemirror-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    note: {
      /**
       * Toggle a paragraph
       */
      wrapNote: () => ReturnType;
    };
  }
}

export default Node.create({
  name: "note",

  priority: 1000,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      tag: "section",
    };
  },

  group: "note",

  content: "block+",

  parseHTML() {
    return [{ tag: "section" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "section",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      wrapNote:
        () =>
        ({ commands, chain }) => {
          console.log("wrapping");
          return chain()
            .wrapIn("note")
            .selectParentNode()
            .selectParentNode()
            .wrapIn("collection")
            .focus()
            .run();
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Alt-a": () => this.editor.commands.wrapNote(),
    };
  },
});
