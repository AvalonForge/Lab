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
  */
  {
    path: "/typescale",
    name: "Typescale",
    component: () => import("@/views/Typescale.vue"),
    meta: {
      dev: true,
      timestamp: "07.18.22",
    },
  },
  {
    path: "/reverse-engineering-yjs",
    name: "Reverse Engineering Yjs",
    component: () => import("@/views/reverse-engineering-yjs.vue"),
    meta: {
      dev: true,
      timestamp: "07.21.22",
    },
  },
  {
    path: "/git-like-document-history",
    name: "Git Like Document History",
    component: () => import("@/views/git-like-document-history.vue"),
    meta: {
      dev: true,
      timestamp: "07.25.22",
    },
  },
  {
    path: "/conflict-free-replicated-timelines",
    name: "Conflict Free Replicated Timelines",
    component: () => import("@/views/conflict-free-replicated-timelines.vue"),
    meta: {
      dev: true,
      timestamp: "07.25.22",
      live: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
