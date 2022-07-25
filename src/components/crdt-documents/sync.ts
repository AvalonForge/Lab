import { Plugin, PluginKey } from "prosemirror-state";

export const SyncPluginKey = new PluginKey("sync");

export const sync = (yfragment) =>
  new Plugin({
    key: SyncPluginKey,
    state: {
      init: () => {
        return {
          type: yfragment,
          doc: yfragment.doc,
          binding: null,
          snapshot: null,
          prevSnapshot: null,
          isChangeOrigin: false,
          addToHistory: true,
        };
      },
      apply: (tr, state) => {
        const change = tr.getMeta(SyncPluginKey);
        if (change !== undefined) {
          console.log("change:", change);
          state = Object.assign({}, state);
          for (const key in change) {
            state[key] = change[key];
          }
        }

        state.addToHistory = tr.getMeta("addToHistory") !== false;

        state.isChangeOrigin = change !== undefined && !!change.isChangeOrigin;

        if (state.binding !== null) {
          if (
            change !== undefined &&
            (change.snapshot != null || change.prevSnapshot != null)
          ) {
            setTimeout(() => {
              if (state.binding == null || state.binding.isDestroyed) {
                return;
              }
              if (change.restore == null) {
                state.binding._renderSnapshot(
                  change.snapshot,
                  change.prevSnapshot,
                  state
                );
              } else {
                state.binding._renderSnapshot(
                  change.snapshot,
                  change.snapshot,
                  state
                );

                delete state.restore;
                delete state.snapshot;
                delete state.prevSnapshot;
                state.binding._prosemirrorChanged(
                  state.binding.prosemirrorView.state.doc
                );
              }
            }, 0);
          }
        }
        return state;
      },
    },
    view: (view) => {},
  });
