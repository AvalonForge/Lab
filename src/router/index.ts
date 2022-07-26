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
    path: "/crdt-documents",
    name: "CRDT Documents",
    component: () => import("@/views/CRDT-Documents.vue"),
    meta: {
      dev: true,
      timestamp: "07.21.22",
      live: true,
    },
  },
  {
    path: "/document-versions",
    name: "Document Versions",
    component: () => import("@/views/Document-Versions.vue"),
    meta: {
      dev: true,
      timestamp: "07.25.22",
    },
  },
  {
    path: "/conflict-free-replicated-documents",
    name: "Conflict Free Replicated Documents",
    component: () => import("@/views/Conflict-Free-Replicated-Documents.vue"),
    meta: {
      dev: true,
      timestamp: "07.25.22",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
