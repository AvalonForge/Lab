import { Plugin, PluginKey, NodeSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Slice, Node as ProseMirrorNode } from "prosemirror-model";
import { Extension, Editor, findParentNodeClosestToPos } from "@tiptap/core";

// :: (options: ?Object) → Plugin
// Create a plugin that, when added to a ProseMirror instance,
// causes a decoration to show up at the drop position when something
// is dragged over the editor.

export const DropCursorPluginKey = new PluginKey("drop-cursor");

export default Extension.create({
  name: "DropCursor",
  addProseMirrorPlugins() {
    const editor = this.editor;
    return [
      new Plugin({
        key: DropCursorPluginKey,
        view(editorView) {
          return new DropCursorView(editorView, editor);
        },
      }),
    ];
  },
});

class DropCursorView {
  editor: Editor;
  editorView: EditorView;
  width: number;
  color: string;
  class: string;
  cursorPos: any;
  element: any;
  timeout: any;
  col: boolean;
  colBox: any;
  colPos: number;
  side: string;
  sideElement: any;
  sideContent: any;
  sideSize: number;
  dragging: any;
  target: any;
  sidePlugin: boolean;

  handlers: any;

  constructor(editorView: EditorView, editor: Editor) {
    this.editor = editor;
    this.editorView = editorView;
    this.width = 1;
    this.color = "#262626";
    this.class = "";
    this.cursorPos = null;
    this.colBox = null;
    this.colPos = 0;
    this.sideElement = null;
    this.sideContent = null;
    this.sideSize = 0;
    this.timeout = null;

    this.side = "";
    this.col = false;

    this.sidePlugin =
      typeof editor.extensionManager.extensions.find(
        (extension) => extension.name == "row"
      ) != "undefined";

    this.handlers = ["dragover", "dragend", "drop", "dragleave"].map((name) => {
      const handler = (e: MouseEvent) => (this as any)[name](e);
      (editorView.dom as any).addEventListener(name, handler);
      return { name, handler };
    });
  }

  destroy() {
    this.handlers.forEach(({ name, handler }: any) =>
      this.editorView.dom.removeEventListener(name, handler)
    );
  }

  update(editorView: EditorView, prevState: any) {
    if (this.cursorPos != null && prevState.doc != editorView.state.doc) {
      if (this.cursorPos > editorView.state.doc.content.size)
        this.setCursor(null);
      else this.updateOverlay();
    }
  }

  setCursor(pos: any) {
    if (pos == this.cursorPos) return;
    this.cursorPos = pos;
    if (pos == null) {
      this.element.parentNode.removeChild(this.element);
      this.element = null;
    } else {
      this.updateOverlay();
    }
  }

  setSide(side: string, content: any, element: any, size: number) {
    if (side == this.side) return;
    this.side = side;
    this.sideContent = content;
    this.sideElement = element;
    this.sideSize = size;
    this.updateOverlay();
  }
  setCol(col: boolean, box: any, pos: number) {
    this.col = col;
    this.colBox = box;
    this.colPos = pos;
  }

  updateOverlay() {
    const $pos = this.editorView.state.doc.resolve(this.cursorPos);
    let rect;
    if (!$pos.parent.inlineContent) {
      const before = $pos.nodeBefore,
        after = $pos.nodeAfter;
      if (before || after) {
        const nodeRect = (
          this.editorView.nodeDOM(
            this.cursorPos - (before ? before.nodeSize : 0)
          ) as any
        ).getBoundingClientRect();
        let top = before ? nodeRect.bottom : nodeRect.top;
        if (before && after)
          top =
            (top +
              (
                this.editorView.nodeDOM(this.cursorPos) as any
              ).getBoundingClientRect().top) /
            2;
        rect = {
          left: nodeRect.left,
          right: nodeRect.right,
          top: top - this.width / 2,
          bottom: top + this.width / 2,
        };
      }
    }
    if (!rect) {
      const coords = this.editorView.coordsAtPos(this.cursorPos);
      rect = {
        left: coords.left - this.width / 2,
        right: coords.left + this.width / 2,
        top: coords.top,
        bottom: coords.bottom,
      };
    }

    const parent = (this.editorView.dom as any).offsetParent;
    if (!this.element) {
      this.element = parent.appendChild(document.createElement("div"));
      if (this.class) this.element.className = this.class;
      this.element.style.cssText =
        "position: absolute; z-index: 50; pointer-events: none; background-color: " +
        this.color;
    }
    let parentLeft, parentTop;
    if (
      !parent ||
      (parent == document.body && getComputedStyle(parent).position == "static")
    ) {
      parentLeft = -pageXOffset;
      parentTop = -pageYOffset;
    } else {
      const rect = parent.getBoundingClientRect();
      parentLeft = rect.left - parent.scrollLeft;
      parentTop = rect.top - parent.scrollTop;
    }
    this.element.style["background-color"] = "#262626";
    this.element.style.left = rect.left - parentLeft + "px";
    this.element.style.top = rect.top - parentTop + "px";
    this.element.style.width = rect.right - rect.left + "px";
    this.element.style.height = rect.bottom - rect.top + "px";

    if (this.side.length > 0 && this.sideElement) {
      const box = this.sideElement.getBoundingClientRect();
      this.element.style.width = "6px";
      this.element.style["background-color"] = "rgba(120, 113, 103, .2)";
      this.element.style.top = box.top - parentTop + "px";
      this.element.style.height = box.bottom - box.top + "px";
      if (this.side == "left") {
        this.element.style.left = rect.left - parentLeft + 50 + "px";
      } else if (this.side == "right") {
        this.element.style.left = rect.right - parentLeft - 50 + "px";
      }
    }

    if (this.col) {
      this.element.style.width = "6px";
      this.element.style["background-color"] = "rgba(120, 113, 103, .2)";
      this.element.style.top = this.colBox.top - parentTop + "px";
      this.element.style.height = this.colBox.bottom - this.colBox.top + "px";
      this.element.style.left = this.colBox.right - parentLeft + 3 + "px";
    }
  }

  scheduleRemoval(timeout: any) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.setCursor(null), timeout);
  }

  dragover(event: MouseEvent) {
    this.dragging = this.editorView.dragging;
    /* set what's being dragged */
    /* if the editor isn't editable do nothing */
    if (!this.editorView.editable) return;
    /* if what's being dragged isn't a node do nothing */
    if (!(this.editorView.state.selection as NodeSelection).node) return;
    /* get the position at the mouse location */
    const pos = this.editorView.posAtCoords({
      left: event.clientX,
      top: event.clientY,
    });
    /* if the mouse is inside the element being dragged do nothing */
    if (pos && this.editorView.state.selection.$anchor.pos == pos.inside) {
      this.setSide("", null, null, 0);
      this.setCol(false, null, 0);
      return;
    }
    /* find the node that the mouse is inside */
    const node =
      pos && pos.inside >= 0 && this.editorView.state.doc.nodeAt(pos.inside);
    /* find if the target node disables the drop cursor */
    const disableDropCursor = node && node.type.spec.disableDropCursor;
    const disabled =
      typeof disableDropCursor == "function"
        ? disableDropCursor(this.editorView, pos)
        : disableDropCursor;

    /* set up the side data */
    if (this.sidePlugin) {
      let side = "";
      let sideElement = null;
      let size = 0;
      if (
        event.target &&
        pos &&
        pos.inside > -1 &&
        (event.target as any).matches(".ProseMirror>*") &&
        !(node && node.type.name == "row" && node.childCount >= 3)
      ) {
        /* if the mouse is on the side of a node */
        const box = (event.target as any).getBoundingClientRect();
        const left = event.clientX - box.left < 50;
        if (left) side = "left";
        const right = box.right - event.clientX < 50;
        if (right) side = "right";
        if (side) sideElement = event.target;
        if (node) size = node.nodeSize;
      }
      /* update the side */
      this.setSide(
        side,
        node
          ? [{ type: node.type.name, content: node.content.toJSON() }]
          : null,
        sideElement,
        size
      );

      /* set up the col data */
      let col = false;
      let colBox = null;
      let colPos = 0;
      if (pos && node && node.type.name == "row" && node.childCount < 3) {
        /* check if a new col can be added */
        const colElement = this.editor.view.domAtPos(pos.pos - 1);
        if ((colElement.node as any).getBoundingClientRect) {
          col = true;
          colBox = (colElement.node as any).getBoundingClientRect();
          colPos = pos.pos;
        }
      }
      /* update the col */
      this.setCol(col, colBox, colPos);
    }

    if (pos && !disabled) {
      /* otherwise */
      let target = pos.pos as any;
      if (this.editorView.dragging && this.editorView.dragging.slice) {
        target = dropPoint(
          this.editorView.state.doc,
          target,
          this.editorView.dragging.slice
        );
        if (target == null) return this.setCursor(null);
      }
      this.setCursor(target);
      this.scheduleRemoval(5000);
    }
  }

  dragend(event: MouseEvent) {
    this.scheduleRemoval(20);
  }

  drop() {
    if (this.side) {
      /* if it's being dropped on the side of a node*/
      if (this.dragging.slice.content.toJSON()[0].type != "row") {
        /* the node being dropped is NOT already a row */
        if (
          this.sideContent[0].type == "row" &&
          this.sideContent[0].content.length < 3
        ) {
          /* if it's being dropped on a row */
          if (this.side == "left") {
            /* if it's dropped on the left */
            this.editor
              .chain()
              .deleteSelection()
              .insertContentAt(
                this.editorView.state.selection.anchor > 0
                  ? this.editorView.state.selection.anchor + 1
                  : this.editorView.state.selection.anchor + 1,
                [{ type: "col", content: this.dragging.slice.content.toJSON() }]
              )
              .run();
          } else if (this.side == "right") {
            /* if it's being dropped on the right */
            this.editor
              .chain()
              .deleteSelection()
              .insertContentAt(
                this.editorView.state.selection.anchor > 0
                  ? this.editorView.state.selection.anchor - 1
                  : this.editorView.state.selection.anchor - 1,
                [{ type: "col", content: this.dragging.slice.content.toJSON() }]
              )
              .run();
          }
        } else {
          if (this.side == "left") {
            /* if it's being dropped on the left */
            const size = this.sideSize + this.dragging.slice.size;
            this.editor
              .chain()
              .deleteRange({
                from: this.editorView.state.selection.anchor,
                to: this.editorView.state.selection.anchor + size,
              })
              .insertContentAt(
                this.editorView.state.selection.anchor > 0
                  ? this.editorView.state.selection.anchor - 1
                  : this.editorView.state.selection.anchor,
                [
                  {
                    type: "row",
                    content: [
                      {
                        type: "col",
                        content: this.dragging.slice.content.toJSON(),
                      },
                      { type: "col", content: this.sideContent },
                    ],
                  },
                ]
              )
              .run();
          } else if (this.side == "right") {
            /* if it's being dropped on the right */
            const size = this.sideSize + this.dragging.slice.size;
            this.editor
              .chain()
              .deleteRange({
                from: this.editorView.state.selection.head - size,
                to: this.editorView.state.selection.head,
              })
              .run();
            this.editor
              .chain()
              .insertContentAt(this.editorView.state.selection.anchor, [
                {
                  type: "row",
                  content: [
                    { type: "col", content: this.sideContent },
                    {
                      type: "col",
                      content: this.dragging.slice.content.toJSON(),
                    },
                  ],
                },
              ])
              .run();
          }
        }
      }
    }
    if (this.col && !this.side) {
      this.editor
        .chain()
        .deleteSelection()
        .insertContentAt(this.colPos, [
          { type: "col", content: this.dragging.slice.content.toJSON() },
        ])
        .run();
    }
    this.scheduleRemoval(20);
  }

  dragleave(event: MouseEvent) {
    if (
      event.target == this.editorView.dom ||
      !this.editorView.dom.contains(event.relatedTarget as any)
    )
      this.setCursor(null);
  }
}

function dropPoint(
  doc: ProseMirrorNode,
  pos: number,
  slice: Slice
): number | null {
  const $pos = doc.resolve(pos);
  if (!slice.content.size) return pos;
  let content = slice.content;
  for (let i = 0; i < slice.openStart; i++)
    content = content.firstChild!.content;
  for (
    let pass = 1;
    pass <= (slice.openStart == 0 && slice.size ? 2 : 1);
    pass++
  ) {
    for (let d = $pos.depth; d >= 0; d--) {
      const bias =
        d == $pos.depth
          ? 0
          : $pos.pos <= ($pos.start(d + 1) + $pos.end(d + 1)) / 2
          ? -1
          : 1;
      const insertPos = $pos.index(d) + (bias > 0 ? 1 : 0);
      const parent = $pos.node(d);
      let fits: boolean | null | undefined = false;
      if (pass == 1) {
        fits = parent.canReplace(insertPos, insertPos, content);
      } else {
        const wrapping = parent
          .contentMatchAt(insertPos)
          .findWrapping(content.firstChild!.type);
        fits =
          wrapping && parent.canReplaceWith(insertPos, insertPos, wrapping[0]);
      }
      if (fits)
        return bias == 0
          ? $pos.pos
          : bias < 0
          ? $pos.before(d + 1)
          : $pos.after(d + 1);
    }
  }
  return null;
}
