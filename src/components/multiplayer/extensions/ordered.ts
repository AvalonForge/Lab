import { Node, mergeAttributes, wrappingInputRule } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    orderedList: {
      /**
       * Toggle an ordered list
       */
      toggleOrderedList: () => ReturnType;
    };
  }
}

export const inputRegex = /^(\d+)\.\s$/;

export default Node.create({
  name: "orderedList",

  group: "block list",
  content: "listItem+",
  draggable: true,

  addAttributes() {
    return {
      start: {
        default: 1,
        parseHTML: (element) => {
          return element.hasAttribute("start")
            ? parseInt(element.getAttribute("start") || "", 10)
            : 1;
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "ol",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { start, ...attributesWithoutStart } = HTMLAttributes;

    return start === 1
      ? ["ol", mergeAttributes(attributesWithoutStart), 0]
      : ["ol", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      toggleOrderedList:
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
        getAttributes: (match) => ({ start: +match[1] }),
        joinPredicate: (match, node) =>
          node.childCount + node.attrs.start === +match[1],
      }),
    ];
  },
});
