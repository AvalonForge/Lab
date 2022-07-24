import App from "./App.vue";
import { createApp } from "vue";
import router from "@/router/index";
import "./styles.css";
import "./core.css";
import "./prosemirror.css";
import "./lab.css";

export const app = createApp(App);
app.use(router);
app.mount("#app");
