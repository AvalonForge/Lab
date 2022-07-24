import { Node } from "@tiptap/core";

export default Node.create({
  name: "row",
  group: "row",
  content: "col{1,3}",
  draggable: true,
  parseHTML() {
    return [{ tag: "div[data-type=row]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", { "data-type": "row", class: "row flex gap-12" }, 0];
  },
});
