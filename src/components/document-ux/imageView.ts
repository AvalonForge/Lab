import { Plugin, PluginKey } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import schema from "./schema";

export const ImageViewPluginKey = new PluginKey("image-view");

export const imageView = new Plugin({
  key: ImageViewPluginKey,
  props: {
    handleDOMEvents: {
      drop: (view, event) => {
        if (!event.dataTransfer) return false;
        const files = event.dataTransfer.files;
        if (files.length == 0) return false;

        const sel = view.state.selection;

        event.preventDefault();
        Array.from(files).forEach((file) => {
          if (["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (res) => {
              const tr = view.state.tr.insert(
                sel.anchor,
                schema.nodes["image"].create({ src: reader.result })
              );
              view.dispatch(tr);
            };
          }
        });
        return true;
      },
    },
    nodeViews: {
      image: (node: any, view: EditorView, getPos: any) => {
        const dom = document.createElement("div");
        dom.style.overflow = "hidden";
        dom.style.display = "block";
        dom.style.height = `${node.attrs.height}px`;
        const contentDOM = document.createElement("div");
        dom.appendChild(contentDOM);
        if (node.attrs.src.length > 0) {
          dom.style.resize = "vertical";
          const img = document.createElement("img");
          img.style.width = "100%";
          img.style.height = "100%";
          img.style.objectFit = "contain";
          img.setAttribute("src", node.attrs.src);
          dom.appendChild(img);

          dom.addEventListener("mouseup", (event) => {
            const box = (event.target as any).getBoundingClientRect();
            if (box) {
              const tr = view.state.tr.setNodeMarkup(
                getPos(),
                schema.nodes["image"],
                { src: node.attrs.src, height: box.height }
              );
              view.dispatch(tr);
            }
          });
        } else {
          dom.className = "rounded-2 px-3 py-2 border";
          dom.style.borderColor = "var(--type-color)";
          dom.addEventListener("drop", (event) => {
            if (!event.dataTransfer) return;
            const files = event.dataTransfer.files;
            if (files.length == 0) return;

            event.preventDefault();
            const sel = view.state.selection;

            if (
              ["image/png", "image/jpg", "image/jpeg"].includes(
                Array.from(files)[0].type
              )
            ) {
              const reader = new FileReader();
              reader.readAsDataURL(Array.from(files)[0]);
              reader.onload = (res) => {
                const tr = view.state.tr.setNodeMarkup(
                  getPos(),
                  schema.nodes["image"],
                  { src: reader.result, height: "auto" }
                );
                view.dispatch(tr);
              };
            }
          });
          const guard = document.createElement("div");
          guard.contentEditable = "false";
          guard.style.display = "flex";
          const input = document.createElement("input");
          input.placeholder = "Drop or link an image";
          input.className = "outline-none bg-none flex-grow";
          input.addEventListener("focus", (event) => {
            event.stopPropagation();
          });
          input.addEventListener("click", (event) => {
            event.stopPropagation();
          });
          input.addEventListener("keydown", (event: any) => {
            event.stopPropagation();
            if (event.key == "Enter") {
              event.preventDefault();
              event.stopPropagation();
              const tr = view.state.tr.setNodeMarkup(
                getPos(),
                schema.nodes["image"],
                { src: event.target.value, height: "auto" }
              );
              view.dispatch(tr);
            }
          });
          guard.appendChild(input);

          const submit = document.createElement("div");
          submit.innerHTML = `
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              fill="var(--type-color)"
              class="icon clickable"
            >
              <path d="M211.8 339.8C200.9 350.7 183.1 350.7 172.2 339.8L108.2 275.8C97.27 264.9 97.27 247.1 108.2 236.2C119.1 225.3 136.9 225.3 147.8 236.2L192 280.4L300.2 172.2C311.1 161.3 328.9 161.3 339.8 172.2C350.7 183.1 350.7 200.9 339.8 211.8L211.8 339.8zM0 96C0 60.65 28.65 32 64 32H384C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96zM48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80H64C55.16 80 48 87.16 48 96z"/>
            </svg>
          `;
          submit.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            const tr = view.state.tr.setNodeMarkup(
              getPos(),
              schema.nodes["image"],
              { src: input.value, height: "auto" }
            );
            view.dispatch(tr);
          });
          guard.appendChild(submit);

          dom.appendChild(guard);
        }

        return {
          dom,
          contentDOM,
          stopEvent: () => {
            return true;
          },
        };
      },
    },
  },
});
