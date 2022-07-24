import { Node, findParentNodeClosestToPos } from "@tiptap/core";
import { NodeSelection } from "prosemirror-state";
import { ResolvedPos } from "prosemirror-model";

export default Node.create({
  name: "col",
  group: "col",
  isolating: true,
  content: "block+",
  parseHTML() {
    return [{ tag: "div[data-type=col]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { "data-type": "col", class: "border-l-2 border-warm flex-1" },
      0,
    ];
  },
  addKeyboardShortcuts() {
    return {
      Backspace: () => {
        console.log("executes");
        const { $anchor } = this.editor.state.selection;

        const row = findParentNodeClosestToPos($anchor, (node) => {
          return node.type.name == "row";
        });
        if (row) {
          const col = findParentNodeClosestToPos($anchor, (node) => {
            return node.type.name == "col";
          });
          if (!col) return false;

          if (col.start + 1 == $anchor.pos && col.node.textContent.length)
            return true;

          if (!col.node.textContent.length) {
            const res = this.editor.chain().deleteNode("col").run();
            if (row.node.childCount <= 2) {
              const content = row.node.content.toJSON();
              if (row.node.firstChild && row.pos + 1 == col.pos) {
                // first
                if ((row.node.content.toJSON() as any)[1]) {
                  // sometimes this is undefined ?
                  return this.editor
                    .chain()
                    .selectParentNode()
                    .selectParentNode()
                    .deleteSelection()
                    .insertContent(
                      (row.node.content.toJSON() as any)[1].content
                    )
                    .run();
                } else {
                  return this.editor
                    .chain()
                    .selectParentNode()
                    .selectParentNode()
                    .deleteSelection()
                    .run();
                }
              } else {
                // second
                return !this.editor
                  .chain()
                  .selectNodeBackward()
                  .selectParentNode()
                  .deleteSelection()
                  .insertContent((row.node.content.toJSON() as any)[0].content)
                  .run();
              }
            }
            return res;
          }
        }
        if (this.editor.can().selectNodeBackward()) {
          const findCutBefore = function (
            $pos: ResolvedPos
          ): ResolvedPos | null {
            if (!$pos.parent.type.spec.isolating)
              for (let i = $pos.depth - 1; i >= 0; i--) {
                if ($pos.index(i) > 0)
                  return $pos.doc.resolve($pos.before(i + 1));
                if ($pos.node(i).type.spec.isolating) break;
              }
            return null;
          };

          const { $head, empty } = this.editor.state.selection;
          let $cut = $head as ResolvedPos | null;
          if (!empty) return false;

          if ($head.parent.isTextblock) {
            if (
              this.editor.view
                ? !this.editor.view.endOfTextblock(
                    "backward",
                    this.editor.state
                  )
                : $head.parentOffset > 0
            )
              return false;
            $cut = findCutBefore($head);
          }
          const node = $cut && $cut.nodeBefore;
          console.log(node);
          if (node && node.type.name == "row")
            return this.editor.commands.selectNodeBackward();
        }
        return false;
      },
    };
  },
});
