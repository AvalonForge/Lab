import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    toggle: {
      /**
       * insert a toggle
       */
      insertToggle: () => ReturnType;
    };
  }
}

export default Node.create({
  name: "toggle",

  group: "block",
  content: "paragraph block*",
  draggable: true,

  parseHTML() {
    return [{ tag: "div[data-type: toggle]" }];
  },

  renderHTML({ node }) {
    return [
      "div",
      mergeAttributes({ "data-type": "toggle", class: "toggle" }),
      [
        "input",
        {
          type: "checkbox",
        },
      ],
      ["div", 0],
    ];
  },
});
