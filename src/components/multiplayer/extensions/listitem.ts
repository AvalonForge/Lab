import { Node, mergeAttributes } from "@tiptap/core";

export interface ListItemOptions {
  HTMLAttributes: Record<string, any>;
}

export default Node.create<ListItemOptions>({
  name: "listItem",

  content: "paragraph",
  draggable: true,
  defining: true,

  parseHTML() {
    return [
      {
        tag: "li",
      },
    ];
  },

  renderHTML() {
    return ["li", 0];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name),
    };
  },
});
