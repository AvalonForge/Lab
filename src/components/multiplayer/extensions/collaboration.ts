import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Step } from "prosemirror-transform";
import { Decoration, DecorationSet } from "prosemirror-view";
import { history } from "prosemirror-history";
import { collab, sendableSteps, receiveTransaction } from "prosemirror-collab";

export interface Cursor {
  type: "+" | "=" | "-";
  uid: string;
  name?: string;
  color?: string;
  pos: {
    anchor: number;
    head: number;
  } | null;
}

export const CollaborationPluginKey = new PluginKey("collaboration");

export default (
  websocket: WebSocket,
  setUser: (user: { uid: string; name: string; color: string }) => void,
  setCursor: (cursor: Cursor) => void,
  mapCursors: any,
  getCursorHighlights: (doc: any) => DecorationSet
) =>
  Extension.create({
    name: "collaboration",
    addStorage() {
      return {
        websocket: websocket,
        latency: 0,
        receivedLength: 0,
        version: 0,
        uid: "",
        cursors: {},
      };
    },
    addProseMirrorPlugins() {
      if (websocket == null) {
        console.warn("no url provided");
        return [];
      }

      /* Set Up Listener */
      websocket.addEventListener("message", (message: any) => {
        /* Handle an Error */
        if (message.data === "status") {
          console.warn("¯_(ツ)_/¯");
        } else {
          const res = JSON.parse(message.data);
          /* If it's a cursor change, handle it */
          if (res.type == "new-user") {
            setCursor({
              type: "+",
              uid: res.uid,
              name: res.name,
              color: res.color,
              pos: null,
            });
          } else if (res.type == "move-user") {
            if (res.uid != this.storage.uid) {
              setCursor({ type: "=", uid: res.uid, pos: res.pos });
              const tr = this.editor.view.state.tr;
              tr.setMeta("update-cursor", true);
              this.editor.view.dispatch(tr);
            }
          } else if (res.type == "remove-user") {
            setCursor({ type: "-", uid: res.uid, pos: null });
          } else if (res.doc) {
            this.storage.uid = res.identity.uid;
            this.editor.view.dispatch(
              receiveTransaction(
                this.editor.view.state,
                res.doc.steps.map((s: any) =>
                  Step.fromJSON(this.editor.schema, s)
                ),
                res.doc.clientIDs
              )
            );
            setUser({
              uid: res.identity.uid,
              name: res.identity.name,
              color: res.identity.color,
            });
            Object.keys(res.cursors).forEach((uid: string) => {
              setCursor({
                type: "+",
                uid: uid,
                name: res.cursors[uid].name,
                color: res.cursors[uid].color,
                pos: res.cursors[uid].pos,
              });
              const tr = this.editor.view.state.tr;
              tr.setMeta("update-cursor", true);
              this.editor.view.dispatch(tr);
            });
          } else if (!res.steps) {
            console.warn("no steps received", res);
          } else {
            this.storage.version = res.version;
            this.storage.receivedLength += 1;
            if (this.storage.uid == res.timestamp.uid) {
              this.storage.latency =
                (this.storage.latency * (this.storage.receivedLength - 1) +
                  (new Date().getTime() - res.timestamp.moment)) /
                this.storage.receivedLength;
            }

            this.editor.view.dispatch(
              receiveTransaction(
                this.editor.view.state,
                res.steps.map((s: any) => Step.fromJSON(this.editor.schema, s)),
                res.clientIDs
              )
            );
          }
        }
      });
      /* Set Up Error Handler */
      websocket.addEventListener("close", (error: any) => {
        console.warn("error from websocket");
        console.log(websocket);
        websocket = new WebSocket(websocket.url);
      });
      websocket.addEventListener("error", (error: any) => {
        console.warn("error from websocket");
        console.log(websocket);
        websocket = new WebSocket(websocket.url);
      });

      return [
        collab(),
        new Plugin({
          key: CollaborationPluginKey,
          props: {
            decorations(state) {
              return getCursorHighlights(state.doc);
            },
          },
          state: {
            init(_, { doc }) {
              return DecorationSet.create(doc, []);
            },
            apply: (tr, value, old, state) => {
              /* check if there are sendable document changes */
              if (!tr.getMeta("cursor-update")) {
                if (tr.selectionSet) {
                  const sendable = sendableSteps(state);
                  if (sendable) {
                    console.log(sendable.steps.map((s) => s.toJSON()));
                    websocket.send(
                      JSON.stringify({
                        version: sendable.version,
                        steps: sendable.steps.map((s) => s.toJSON()),
                        clientID: sendable.clientID,
                        timestamp: {
                          uid: this.storage.uid,
                          moment: new Date().getTime(),
                        },
                      })
                    );
                  }
                  websocket.send(
                    JSON.stringify({
                      type: "move-user",
                      uid: this.storage.uid,
                      pos: {
                        anchor: tr.selection.anchor,
                        head: tr.selection.head,
                      },
                      timestamp: new Date().getTime(),
                    })
                  );
                }
                mapCursors(tr);
              }
            },
          },
        }),
      ];
    },
  });
