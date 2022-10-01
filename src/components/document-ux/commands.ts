import {
  EditorState,
  Transaction,
  AllSelection,
  TextSelection,
} from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { NodeType, ContentMatch } from "prosemirror-model";
import schema from "./schema";

export type Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
  view: EditorView
) => boolean;

export const hardBreak: Command = function (state, dispatch, view) {
  if (dispatch) {
    const sel = state.selection;
    const tr = state.tr.insert(sel.to, schema.nodes["hard-break"].create());
    dispatch(tr);
    return true;
  }
  return false;
};

export const createNodeNear: (node: NodeType) => Command =
  (node) => (state, dispatch) => {
    let sel = state.selection,
      { $from, $to } = sel;
    if (
      sel instanceof AllSelection ||
      $from.parent.inlineContent ||
      $to.parent.inlineContent
    )
      return false;
    if (!node || !node.isTextblock) return false;
    if (dispatch) {
      let side = (
        !$from.parentOffset && $to.index() < $to.parent.childCount ? $from : $to
      ).pos;
      let tr = state.tr.insert(side, node.createAndFill()!);
      tr.setSelection(TextSelection.create(tr.doc, side + 1));
      dispatch(tr.scrollIntoView());
    }
    return true;
  };

export const stopTab: Command = function (state, dispatch, view) {
  if (dispatch) {
    return true;
  }
  return false;
};

// helpers
function defaultBlockAt(match: ContentMatch) {
  for (let i = 0; i < match.edgeCount; i++) {
    let { type } = match.edge(i);
    if (type.isTextblock && !type.hasRequiredAttrs()) return type;
  }
  return null;
}
