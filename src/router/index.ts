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
      path: "/inline-notes",
      name: "Inline Notes",
      component: () => import("@/views/InlineNotes.vue"),
      meta: {
          dev: true,
          timestamp: "6.05.22"
      },
  },
  {
    path: "/perlin-noise",
    name: "Perlin Noise",
    component: () => import("@/views/PerlinNoise.vue"),
    meta: {
      dev: false,
        timestamp: "7.12.22"
    },
  },
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
    path: "/document-crdt",
    name: "Document CRDT",
    component: () => import("@/views/document-crdt.vue"),
    meta: {
      dev: true,
      timestamp: "07.21.22",
      live: true,
    },
  },
  {
    path: "/git-like-document-history",
    name: "Git Like Document History",
    component: () => import("@/views/git-like-document-history.vue"),
    meta: {
      dev: true,
      timestamp: "07.25.22",
      hidden: true,
    },
  },
  {
    path: "/conflict-free-replicated-timelines",
    name: "Conflict Free Replicated Timelines",
    component: () => import("@/views/conflict-free-replicated-timelines.vue"),
    meta: {
      dev: true,
      timestamp: "07.25.22",
      hidden: true,
    },
  },
  {
    path: "/atomic-ux",
    name: "Atomic UX",
    component: () => import("@/views/atomic-ux.vue"),
    meta: {
      dev: true,
      timestamp: "10.16.22",
        hidden: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
