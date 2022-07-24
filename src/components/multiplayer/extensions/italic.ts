import {
  Mark,
  markInputRule,
  markPasteRule,
  mergeAttributes,
} from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    italic: {
      /**
       * Toggle an italic mark
       */
      toggleItalic: () => ReturnType;
    };
  }
}

export const starInputRegex = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))$/;
export const starPasteRegex = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))/g;

export default Mark.create({
  name: "italic",

  parseHTML() {
    return [
      {
        tag: "em",
      },
      {
        tag: "i",
        getAttrs: (node) =>
          (node as HTMLElement).style.fontStyle !== "normal" && null,
      },
      {
        style: "font-style=italic",
      },
    ];
  },

  renderHTML() {
    return ["em", 0];
  },

  addCommands() {
    return {
      toggleItalic:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-i": () => this.editor.commands.toggleItalic(),
      "Mod-I": () => this.editor.commands.toggleItalic(),
    };
  },

  addInputRules() {
    return [
      markInputRule({
        find: starInputRegex,
        type: this.type,
      }),
    ];
  },

  addPasteRules() {
    return [
      markPasteRule({
        find: starPasteRegex,
        type: this.type,
      }),
    ];
  },
});
