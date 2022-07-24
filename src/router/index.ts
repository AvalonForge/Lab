import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouteRecord,
} from "vue-router";

/*
is logged in
  yes -> go
  no -> is there a saved auth state
    yes -> login -> go
    no -> go to login page
*/

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Root",
    component: () => import("@/views/Root.vue"),
    meta: {
      dev: false,
    },
  },
  /*
  {
    path: "/multiplayer",
    name: "Multiplayer",
    component: () => import("@/views/Multiplayer.vue"),
  },
  */
  {
    path: "/perlin-noise",
    name: "Perlin Noise",
    component: () => import("@/views/PerlinNoise.vue"),
    meta: {
      dev: true,
    },
  },
  {
    path: "/inline-notes",
    name: "Inline Notes",
    component: () => import("@/views/InlineNotes.vue"),
    meta: {
      dev: true,
    },
  },
  {
    path: "/typescale",
    name: "Typescale",
    component: () => import("@/views/Typescale.vue"),
    meta: {
      dev: true,
    },
  },
  {
    path: "/guerilla-documents",
    name: "Guerilla Documents",
    component: () => import("@/views/Guerilla.vue"),
    meta: {
      dev: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
