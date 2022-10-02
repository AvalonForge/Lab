import { Plugin, PluginKey, TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { setBlockType, wrapIn } from "prosemirror-commands";
import { createNodeNear } from "./commands";
import { ContextMenu, MenuItem } from "./contextmenu";
import schema from "./schema";

export const SlashMenuPluginKey = new PluginKey("slashmenu");

export const slashmenu = (pushMenu: (newMenu: ContextMenu | null) => void) => {
  return new Plugin({
    key: SlashMenuPluginKey,
    state: {
      init: () => {
        return {
          menu: null as null | ContextMenu,
        };
      },
      apply: (_, value) => {
        return value;
      },
    },
    props: {
      handleKeyDown: function (view, event) {
        if (event.key === "/") {
          const sel = view.state.selection;
          console.log(event);
          const start = view.coordsAtPos(sel.from);
          const end = view.coordsAtPos(sel.to);
          const parent = (
            document.querySelector(".ProseMirror") as any
          ).getBoundingClientRect();
          const left =
            Math.max((start.left + end.left) / 2, start.left + 3) - parent.left;
          SlashMenuPluginKey.getState(view.state).menu = new SlashMenu(
            (
              handler: (props: { view: EditorView; search: string }) => void
            ) => {
              handler({
                view: view,
                search: SlashMenuPluginKey.getState(view.state).menu.search,
              });
              pushMenu(null);
            },
            start.bottom - parent.top,
            left,
            Object.values(SlashMenuSuggestions)
          );
          pushMenu(SlashMenuPluginKey.getState(view.state).menu);
        } else if (
          SlashMenuPluginKey.getState(view.state).menu &&
          event.key.match(/^\w$/)
        ) {
          SlashMenuPluginKey.getState(view.state).menu =
            SlashMenuPluginKey.getState(view.state).menu.update({
              search:
                SlashMenuPluginKey.getState(view.state).menu.search +
                event.key.toLowerCase(),
            });
          pushMenu(SlashMenuPluginKey.getState(view.state).menu);
        } else if (SlashMenuPluginKey.getState(view.state).menu) {
          SlashMenuPluginKey.getState(view.state).menu = null;
          pushMenu(null);
        }
        return false;
      },
    },
  });
};

export class SlashMenu extends ContextMenu {
  run: (handler: (props: { view: EditorView; search: string }) => void) => void;

  constructor(
    execute: (
      handler: (props: { view: EditorView; search: string }) => void
    ) => void,
    top: number,
    left: number,
    items: Array<MenuItem>,
    width?: number,
    height?: number,
    search?: string
  ) {
    super(top, left, items, width, height, search);
    this.run = execute;
  }

  update({
    top,
    left,
    search,
  }: {
    top?: number;
    left?: number;
    search: string;
  }): ContextMenu {
    return new SlashMenu(
      this.run,
      top ? top : this.top,
      left ? left : this.left,
      this.items,
      this.width,
      this.height,
      search ? search : this.search
    );
  }
}

export const SlashMenuSuggestions = {
  paragraph: new MenuItem({
    key: "paragraph",
    title: "Paragraph",
    icon: "p",
    description: "",
    handler: (props: { view: EditorView; search: string }) => {
      const tr = props.view.state.tr.delete(
        props.view.state.selection.from - props.search.length - 1,
        props.view.state.selection.from
      );
      props.view.dispatch(tr);
      setBlockType(schema.nodes.paragraph)(
        props.view.state,
        props.view.dispatch
      );
    },
  }),
  h1: new MenuItem({
    key: "h1",
    title: "Heading 1",
    icon: "h1",
    description: "",
    handler: (props: { view: EditorView; search: string }) => {
      const tr = props.view.state.tr.delete(
        props.view.state.selection.from - props.search.length - 1,
        props.view.state.selection.from
      );
      props.view.dispatch(tr);
      setBlockType(schema.nodes.heading, { level: 1 })(
        props.view.state,
        props.view.dispatch
      );
    },
  }),
  blockquote: new MenuItem({
    key: "quote",
    title: "Blockquote",
    icon: "q",
    description: "",
    handler: (props: { view: EditorView; search: string }) => {
      const tr = props.view.state.tr.delete(
        props.view.state.selection.from - props.search.length - 1,
        props.view.state.selection.from
      );
      props.view.dispatch(tr);
      wrapIn(schema.nodes.blockquote)(props.view.state, props.view.dispatch);
    },
  }),
  hr: new MenuItem({
    key: "hr",
    title: "Horizontal Rule",
    icon: "i",
    description: "",
    handler: (props: { view: EditorView; search: string }) => {
      const tr = props.view.state.tr.delete(
        props.view.state.selection.from - props.search.length - 1,
        props.view.state.selection.from
      );
      props.view.dispatch(tr);
      console.log(props.view.state.selection);
      createNodeNear(schema.nodes["horizontal-rule"])(
        props.view.state,
        props.view.dispatch
      );
    },
  }),
  image: new MenuItem({
    key: "img",
    title: "Image",
    icon: "i",
    description: "",
    handler: (props: { view: EditorView; search: string }) => {
      const tr = props.view.state.tr.delete(
        props.view.state.selection.from - props.search.length - 1,
        props.view.state.selection.from
      );
      props.view.dispatch(tr);
      console.log(props.view.state.selection);
      createNodeNear(schema.nodes.image)(props.view.state, props.view.dispatch);
    },
  }),
};
