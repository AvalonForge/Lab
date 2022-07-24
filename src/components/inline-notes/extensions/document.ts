import Document from "@tiptap/extension-document";

export default Document.extend({
  name: "doc",
  //content: "(block | row)+",
  content: "(block | collection)+",
});
