<template lang="html">
  <div class="" :style="{ 'max-width': '40ch' }">
    <!-- Stats -->
    <div class="welcome-letter" v-if="letter" @click="letter = false">
      <article class="bg-paper px-34 py-20 m-85 rounded-12" @click.stop>
        <p>Howdy 👋</p>
        <p>
          Thanks for checking out our lab! We're a team building the most
          <strong>delightful</strong> and <strong>responsive</strong>
          digital office for remote teams.
        </p>
        <p>
          Here we've been developing our collaborative experience to be as fast
          and robust as possible. Invite a friend! Try to break it😈.
        </p>
        <p>
          If you like what you see, consider signing up for early access for our
          <a class="text-type" href="https://www.tryvelocity.xyz"
            ><strong>complete workspace</strong></a
          >
          which includes tools for managing email, relationships, and more! --
          all multiplayer.
        </p>
        <p>
          Best Regards, <br />
          <a href="https://twitter.com/talltimofficial" class="font-script"
            >@talltimofficial</a
          >,
          <a href="https://twitter.com/KlaassenConnor" class="font-script"
            >@KlaassenConnor</a
          >
        </p>
      </article>
    </div>
    <p>
      <a class="text-type" @click="letter = true"
        ><strong class="u">Welcome Letter 💌</strong></a
      >
    </p>
    <p><strong class="u">Stats:</strong></p>

    <div class="">
      <div class="soundboard-item">
        connection:
        {{
          editor.storage.collaboration.websocket.readyState == 0
            ? "CONNECTING"
            : editor.storage.collaboration.websocket.readyState == 1
            ? "OPEN"
            : editor.storage.collaboration.websocket.readyState == 2
            ? "CLOSING"
            : "CLOSED"
        }}
      </div>
      <div class="soundboard-item">
        avg latency: {{ editor.storage.collaboration.latency }} ms
      </div>
      <div class="soundboard-item">
        avg transactions per second:
        {{ editor.storage.TransactionCounter.trPerSecond }}
      </div>
      <div class="soundboard-item">
        total transactions:
        {{ editor.storage.TransactionCounter.trTotal }}
      </div>
    </div>

    <p><strong>Soundboard:</strong></p>

    <div class="flex flex-wrap gap-5">
      <button
        type="button"
        class="soundboard-item flex-grow"
        @click="toggleBold()"
      >
        bold
      </button>
      <button
        type="button"
        class="soundboard-item flex-grow"
        @click="toggleItalic()"
      >
        italic
      </button>
      <button
        type="button"
        class="soundboard-item flex-grow"
        @click="toggleStrike()"
      >
        strike
      </button>
      <button
        type="button"
        class="soundboard-item flex-grow"
        @click="toggleHeading(1)"
      >
        h1
      </button>
      <button
        type="button"
        class="soundboard-item flex-grow"
        @click="toggleHeading(2)"
      >
        h2
      </button>
      <button
        type="button"
        class="soundboard-item flex-grow"
        @click="toggleHeading(3)"
      >
        h3
      </button>
      <button
        type="button"
        class="soundboard-item flex-grow"
        @click="toggleOl()"
      >
        ordered list
      </button>
      <button
        type="button"
        class="soundboard-item flex-grow"
        @click="toggleUl()"
      >
        unordered list
      </button>
      <button
        type="button"
        class="soundboard-item flex-grow"
        @click="toggleCode()"
      >
        code
      </button>
      <!--
      <button
        type="button"
        class="soundboard-item flex-grow"
        @click="insertToggle()"
      >
        insert toggle
      </button>
    --></div>
    <div class="flex items-center">
      <p class="flex-1"><strong>Users:</strong></p>
      <div class="flex-1">
        <strong>You are:</strong>
        <div
          class="sub p-mention rounded-mention inline-block ellipssi"
          :style="{ 'background-color': user.color }"
        >
          {{ user.name }}
        </div>
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <div
        class="sub p-mention rounded-mention ellipsis"
        :key="cursor.uid"
        v-for="cursor in cursors"
        :style="{ 'background-color': cursor.color }"
      >
        {{ cursor.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Editor } from "@tiptap/core";

export default defineComponent({
  name: "Soundboard",
  props: {
    editor: {
      type: Editor,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    cursors: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      letter: false,
      loadTime: 0,
      trPerSecond: 0,
      trThisSecond: 0,
    };
  },
  created: function () {
    console.log(this.editor);
  },
  methods: {
    toggleBold: function () {
      this.editor.chain().focus().toggleBold().run();
    },
    toggleItalic: function () {
      this.editor.chain().focus().toggleItalic().run();
    },
    toggleStrike: function () {
      this.editor.chain().focus().toggleStrike().run();
    },
    toggleHeading: function (level: 1 | 2 | 3) {
      this.editor.chain().focus().toggleHeading({ level: level }).run();
    },
    toggleCode: function () {
      this.editor.chain().focus().toggleCode().run();
    },
    toggleOl: function () {
      this.editor.chain().focus().toggleOrderedList().run();
    },
    toggleUl: function () {
      this.editor.chain().focus().toggleUnorderedList().run();
    },
    insertToggle: function () {
      this.editor
        .chain()
        .focus()
        .insertContent({
          type: "toggle",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "text" }],
            },
          ],
        })
        .run();
    },
  },
});
</script>

<style lang="css" scoped>
.welcome-letter {
  @apply flex items-center justify-center font-sans;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.welcome-letter article {
  max-width: 60ch;
}
</style>
