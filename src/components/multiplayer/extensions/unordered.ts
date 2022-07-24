import { Node, mergeAttributes, wrappingInputRule } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    bulletList: {
      /**
       * Toggle a bullet list
       */
      toggleUnorderedList: () => ReturnType;
    };
  }
}

export const inputRegex = /^\s*([-+*])\s$/;

export default Node.create({
  name: "unorderedList",

  group: "block list",
  draggable: true,
  content: "listItem+",

  parseHTML() {
    return [{ tag: "ul" }];
  },

  renderHTML() {
    return ["ul", 0];
  },

  addCommands() {
    return {
      toggleUnorderedList:
        () =>
        ({ commands }) => {
          return commands.toggleList(this.name, this.options.itemTypeName);
        },
    };
  },

  addInputRules() {
    return [
      wrappingInputRule({
        find: inputRegex,
        type: this.type,
      }),
    ];
  },
});
