import { Node, textblockTypeInputRule } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    code: {
      /**
       * Toggle inline code
       */
      toggleCode: () => ReturnType;
    };
  }
}

export const inputRegex = /(?:^|\s)((?:`)((?:[^`]+))(?:`))$/;
export const pasteRegex = /(?:^|\s)((?:`)((?:[^`]+))(?:`))/g;

export default Node.create({
  name: "code",

  marks: "",
  group: "block",
  content: "text*",
  draggable: true,
  defining: true,
  code: true,

  parseHTML() {
    return [{ tag: "pre" }];
  },

  renderHTML() {
    return ["pre", ["code", 0]];
  },

  addCommands() {
    return {
      toggleCode:
        () =>
        ({ commands }) => {
          return commands.toggleNode("code", "paragraph");
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      // remove code block when at start of document or code block is empty
      Backspace: () => {
        const { empty, $anchor } = this.editor.state.selection;
        const isAtStart = $anchor.pos === 1;

        if (!empty || $anchor.parent.type.name !== this.name) {
          return false;
        }

        if (isAtStart || !$anchor.parent.textContent.length) {
          return this.editor.commands.clearNodes();
        }

        return false;
      },
      // exit node on triple enter
      Enter: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;

        if (!empty || $from.parent.type !== this.type) {
          return false;
        }

        const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;
        const endsWithDoubleNewline = $from.parent.textContent.endsWith("\n\n");

        if (!isAtEnd || !endsWithDoubleNewline) {
          return false;
        }

        return editor
          .chain()
          .command(({ tr }) => {
            tr.delete($from.pos - 2, $from.pos);

            return true;
          })
          .exitCode()
          .run();
      },
    };
  },

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: inputRegex,
        type: this.type,
      }),
    ];
  },
});
