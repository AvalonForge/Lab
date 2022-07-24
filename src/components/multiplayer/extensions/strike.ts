import { Mark, markInputRule, markPasteRule } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    strike: {
      /**
       * Toggle a strike mark
       */
      toggleStrike: () => ReturnType;
    };
  }
}

export const inputRegex = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))$/;
export const pasteRegex = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))/g;

export default Mark.create({
  name: "strike",

  parseHTML() {
    return [
      {
        tag: "s",
      },
      {
        tag: "del",
      },
      {
        tag: "strike",
      },
      {
        style: "text-decoration",
        consuming: false,
        getAttrs: (style) =>
          (style as string).includes("line-through") ? {} : false,
      },
    ];
  },

  renderHTML() {
    return ["s", 0];
  },

  addCommands() {
    return {
      toggleStrike:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
    };
  },

  addInputRules() {
    return [
      markInputRule({
        find: inputRegex,
        type: this.type,
      }),
    ];
  },

  addPasteRules() {
    return [
      markPasteRule({
        find: pasteRegex,
        type: this.type,
      }),
    ];
  },
});
