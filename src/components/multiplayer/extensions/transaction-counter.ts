import { Plugin, PluginKey } from "prosemirror-state";
import { Extension } from "@tiptap/core";

export const TransactionCounterPluginKey = new PluginKey("transaction-counter");

export default Extension.create({
  name: "TransactionCounter",
  addStorage() {
    return {
      trTotal: 0,
      trThisSecond: 0,
      trPerSecond: 0,
    };
  },
  addProseMirrorPlugins() {
    setInterval(() => {
      this.storage.trPerSecond = this.storage.trThisSecond / 5;
      this.storage.trTotal += this.storage.trThisSecond;
      this.storage.trThisSecond = 0;
    }, 5000);
    return [
      new Plugin({
        key: TransactionCounterPluginKey,
        filterTransaction: () => {
          this.storage.trThisSecond = this.storage.trThisSecond + 1;
          return true;
        },
      }),
    ];
  },
});
