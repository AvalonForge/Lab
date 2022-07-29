import {
  EditorState,
  Plugin,
  PluginKey,
  Transaction,
  NodeSelection,
} from "prosemirror-state";
import {
  InputRule,
  wrappingInputRule,
  inputRules,
  textblockTypeInputRule,
} from "prosemirror-inputrules";
import { EditorView } from "prosemirror-view";
import { Schema, NodeType, Attrs, MarkType } from "prosemirror-model";
import schema from "./schema";
import { getNodeType } from "./schema";

export const MarkdownPluginKey = new PluginKey("markdown-commands");

const headingRule = textblockTypeInputRule(
  new RegExp("^(#{1,3})\\s$"),
  schema.nodes["heading"],
  (match: any) => ({ level: match[1].length })
);

const blockquoteRule = wrappingInputRule(
  /^\s*>\s$/,
  schema.nodes["blockquote"]
);

/*
const asideRule = new InputRule(
  new RegExp("^>>>\\s$"),
  (state, match, start, end) => {
    return state.tr.replaceWith(start - 1, end, schema.nodes["aside"].create());
  }
);
*/
/*
const horizontalRuleRule = new InputRule(
  new RegExp("^(---|___)\\s$"),
  (state, match, start, end) => {
    return state.tr.replaceWith(
      start - 1,
      end,
      schema.nodes["horizontal-rule"].create()
    );
  }
);
*/

const codeBlockRule = textblockTypeInputRule(
  /^```$/,
  schema.nodes["code-block"]
);

const UnorderedListRule = wrappingInputRule(
  /^\s*([-+*])\s$/,
  schema.nodes["unordered-list"]
);

const OrderedListRule = wrappingInputRule(
  /^(\d+)\.\s$/,
  schema.nodes["ordered-list"],
  (match) => ({ order: +match[1] }),
  (match, node) => node.childCount + node.attrs.order == +match[1]
);

/*
const CheckListRule = new InputRule(
  /^(\[\]|\[\s\])\s$/,
  (state, match, start, end) => {
    console.log("does it run");
    return state.tr.replaceWith(
      start - 1,
      end,
      schema.nodes["check-list"].create(
        {},
        schema.nodes["checklistitem"].create(
          {},
          schema.nodes["paragraph"].create()
        )
      )
    );
  }
);
*/

const boldRule = markInputRule(
  /(?:^|\s)((?:\*\*)(?<content>(?:[^*]+))(?:\*\*))$/,
  schema.marks["strong"],
  null
);

const italicRule = markInputRule(
  /(?:^|\s)((?:\*)(?<content>(?:[^*]+))(?:\*))$/,
  schema.marks["italic"],
  null
);

const strikeRule = markInputRule(
  /(?:^|\s)((?:~~)((?<content>[^~]+))(?:~~))$/,
  schema.marks["strike"],
  null
);

const codeRule = markInputRule(
  /(?:^|\s)`(?<content>[^`]+)`$/,
  schema.marks["code"],
  null
);

export default (schema: Schema) => {
  const rules = [];
  if (typeof schema.nodes["heading"] != undefined) rules.push(headingRule);
  if (typeof schema.nodes["blockquote"] != undefined)
    rules.push(blockquoteRule);
  if (typeof schema.nodes["code-block"] != undefined) rules.push(codeBlockRule);
  //if (typeof schema.nodes["aside"] != undefined) rules.push(asideRule);
  //if (typeof schema.nodes["horizontal-rule"] != undefined)rules.push(horizontalRuleRule);
  if (typeof schema.nodes["ordered-list"] != undefined)
    rules.push(OrderedListRule);
  if (typeof schema.nodes["unordered-list"] != undefined)
    rules.push(UnorderedListRule);
  //if (typeof schema.nodes["check-list"] != undefined) rules.push(CheckListRule);
  if (typeof schema.marks["strong"] != undefined) rules.push(boldRule);
  if (typeof schema.marks["italic"] != undefined) rules.push(italicRule);
  if (typeof schema.marks["strike"] != undefined) rules.push(strikeRule);
  if (typeof schema.marks["code"] != undefined) rules.push(codeRule);

  return inputRules({ rules: rules });
};

/* Helpers */
export function setNodeType(
  state: EditorState,
  nodeType: NodeType,
  attrs: Attrs | null = null
): Transaction | null {
  const { from, to } = state.selection;
  let applicable = false;
  state.doc.nodesBetween(from, to, (node: any, pos: number) => {
    if (applicable) return false;
    if (!node.isTextblock || node.hasMarkup(nodeType, attrs)) return;
    if (node.type == nodeType) {
      applicable = true;
    } else {
      const $pos = state.doc.resolve(pos);
      const index = $pos.index();
      applicable = $pos.parent.canReplaceWith(index, index + 1, nodeType);
    }
  });
  if (!applicable) return null;
  return state.tr.setBlockType(from, to, nodeType, attrs as Attrs);
}

export function markInputRule(
  regexp: RegExp,
  markType: MarkType,
  getAttrs: any
) {
  return new InputRule(regexp, (state: EditorState, match: any, start, end) => {
    const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    const tr = state.tr;
    if (match && match.groups["content"]) {
      const textStart = start + match[0].indexOf(match.groups["content"]);
      const textEnd = textStart + match.groups["content"].length;
      if (textEnd < end) tr.delete(textEnd, end);
      if (textStart > start) tr.delete(start, textStart);
      end = start + match.groups["content"].length;
    }
    return tr.addMark(start, end, markType.create(attrs));
  });
}

export function extendMark(
  state: EditorState,
  from: number,
  to: number,
  mark: MarkType
) {
  if (state.doc.rangeHasMark(from, to, mark)) {
    let start = from;
    let end = to;
    // start
    if (state.doc.rangeHasMark(start - 1, start, mark)) {
      while (state.doc.rangeHasMark(start - 1, start, mark)) {
        console.log(start);
        start--;
      }
    } else {
      while (!state.doc.rangeHasMark(start, start + 1, mark)) {
        start++;
      }
    }
    //end
    if (state.doc.rangeHasMark(end, end + 1, mark)) {
      while (state.doc.rangeHasMark(end, end + 1, mark)) {
        end++;
      }
    } else {
      while (!state.doc.rangeHasMark(end - 1, end, mark)) {
        end--;
      }
    }

    return { from: start, to: end };
  }
  return null;
}

export function insertAtNextPossible(
  view: EditorView,
  pos: number,
  node: any
): { pos: number; tr: Transaction } | null {
  let inserted = false;
  let out = null;
  view.state.doc.descendants(
    (childNode: any, childPos: any, parentNode: any) => {
      if (!inserted && childPos > pos) {
        const tr = view.state.tr.insert(childPos, node);
        if (tr.docChanged) {
          inserted = true;
          view.dispatch(tr);
          out = { pos: childPos, tr: tr };
        }
      }
      return false;
    }
  );
  if (!inserted) {
    const tr = view.state.tr.insert(view.state.doc.nodeSize - 2, node);
    view.dispatch(tr);
    out = { pos: view.state.doc.nodeSize - 1, tr: tr };
  }
  return out;
}
