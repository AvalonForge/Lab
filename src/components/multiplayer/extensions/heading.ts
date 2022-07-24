import { Node, textblockTypeInputRule } from "@tiptap/core";

export type Level = 1 | 2 | 3 | 4 | 5 | 6;

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    heading: {
      /**
       * Toggle a heading node
       */
      toggleHeading: (attributes: { level: Level }) => ReturnType;
    };
  }
}

export default Node.create({
  name: "heading",

  addOptions() {
    return {
      levels: [1, 2, 3],
    };
  },

  content: "inline*",
  group: "block",
  draggable: true,
  defining: true,

  addAttributes() {
    return {
      level: {
        default: 1,
        rendered: false,
      },
    };
  },

  parseHTML() {
    return this.options.levels.map((level: Level) => ({
      tag: "h" + level,
      attrs: { level },
    }));
  },

  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level = hasLevel ? node.attrs.level : this.options.levels[0];

    return ["h" + level, 0];
  },

  addCommands() {
    return {
      toggleHeading:
        (attributes: { level: Level }) =>
        ({ commands }: any) => {
          if (!this.options.levels.includes(attributes.level)) {
            return false;
          }

          return commands.toggleNode(this.name, "paragraph", attributes);
        },
    };
  },

  addInputRules() {
    return this.options.levels.map((level: number) => {
      return textblockTypeInputRule({
        find: new RegExp(`^(#{1,${level}})\\s$`),
        type: this.type,
        getAttributes: {
          level,
        },
      });
    });
  },
});
