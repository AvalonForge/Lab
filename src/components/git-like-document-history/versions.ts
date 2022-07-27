import { Transform, Step, StepMap } from "prosemirror-transform";
import { EditorState, Transaction, Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet, EditorView } from "prosemirror-view";

export const VersionPluginKey = new PluginKey("versions");

export const versions = (selected: () => Array<number>) =>
  new Plugin({
    key: VersionPluginKey,
    state: {
      init(_, state) {
        return new TrackState(
          [new Span(0, state.doc.content.size, null)],
          [],
          [],
          []
        );
      },
      apply(tr, tracked) {
        if (tr.docChanged) tracked = tracked.applyTransform(tr);
        const commit = tr.getMeta(VersionPluginKey);
        if (commit)
          tracked = tracked.applyCommit(
            commit.message,
            commit.author,
            commit.timestamp
          );
        return tracked;
      },
    },
    props: {
      decorations(state) {
        return getDecorations(state, this, selected());
      },
    },
  });

export function dispatchTransaction(this: EditorView, tr: Transaction) {
  const state = this.state.apply(tr);
  this.updateState(state);
  //setDisabled(state)
}

/* Helper Classes */

export class Span {
  from: number;
  to: number;
  commit: null | number;

  constructor(from: number, to: number, commit: null | number) {
    this.from = from;
    this.to = to;
    this.commit = commit;
  }
}

export class Commit {
  message: string;
  author: number;
  timestamp: Date;
  steps: Array<Step>;
  maps: Array<StepMap>;
  hidden: boolean;

  constructor(
    message: string,
    author: number,
    timestamp: Date,
    steps: Array<Step>,
    maps: Array<StepMap>,
    hidden = false
  ) {
    this.message = message;
    this.author = author;
    this.timestamp = timestamp;
    this.steps = steps;
    this.maps = maps;
    this.hidden = hidden;
  }
}

export class TrackState {
  blameMap: Array<Span>;
  commits: Array<Commit>;
  uncommittedSteps: Array<Step>;
  uncommittedMaps: Array<StepMap>;

  constructor(
    blameMap: Array<Span>,
    commits: Array<Commit>,
    uncommittedSteps: Array<Step>,
    uncommittedMaps: Array<StepMap>
  ) {
    this.blameMap = blameMap;
    this.commits = commits;
    this.uncommittedSteps = uncommittedSteps;
    this.uncommittedMaps = uncommittedMaps;
  }

  applyTransform(transform: Transform) {
    const inverted = transform.steps.map((step, i) =>
      step.invert(transform.docs[i])
    );
    const newBlame = updateBlameMap(
      this.blameMap,
      transform,
      this.commits.length
    );

    return new TrackState(
      newBlame,
      this.commits,
      this.uncommittedSteps.concat(inverted),
      this.uncommittedMaps.concat(transform.mapping.maps)
    );
  }

  applyCommit(message: string, author: number, timestamp: Date) {
    if (this.uncommittedSteps.length == 0) return this;
    const commit = new Commit(
      message,
      author,
      timestamp,
      this.uncommittedSteps,
      this.uncommittedMaps
    );
    return new TrackState(this.blameMap, this.commits.concat(commit), [], []);
  }
}

/* Helper Functions */

function getDecorations(
  state: EditorState,
  versionPlugin: Plugin,
  selectedCommits: Array<number>
): DecorationSet {
  const decos: Array<Decoration> = [];
  const versionState = versionPlugin.getState(state);
  selectedCommits.forEach((commit) => {
    versionState.blameMap
      .filter((span: Span) => span.commit == commit)
      .forEach((span: Span) => {
        decos.push(
          Decoration.inline(span.from, span.to, {
            class: "bg-avalon",
          })
        );
      });
  });
  return DecorationSet.create(state.doc, decos);
}

function updateBlameMap(
  map: Array<Span>,
  transform: Transform,
  id: number
): Array<Span> {
  const result: Array<Span> = [];
  const mapping = transform.mapping;
  for (let i = 0; i < map.length; i++) {
    const span = map[i];
    const from = mapping.map(span.from, 1);
    const to = mapping.map(span.to, -1);
    if (from < to) result.push(new Span(from, to, span.commit));
  }

  for (let i = 0; i < mapping.maps.length; i++) {
    const map = mapping.maps[i];
    const after = mapping.slice(i + 1);
    map.forEach((_s, _e, start, end) => {
      insertIntoBlameMap(result, after.map(start, 1), after.map(end, -1), id);
    });
  }

  return result;
}

function insertIntoBlameMap(
  map: Array<Span>,
  from: number,
  to: number,
  commit: number
) {
  if (from >= to) return;
  let pos = 0;
  let next;
  for (; pos < map.length; pos++) {
    next = map[pos];
    if (next.commit == commit) {
      if (next.to >= from) break;
    } else if (next.to > from) {
      // Different commit, not before
      if (next.from < from) {
        // Sticks out to the left (loop below will handle right side)
        const left = new Span(next.from, from, next.commit);
        if (next.to > to) map.splice(pos++, 0, left);
        else map[pos++] = left;
      }
      break;
    }
  }

  while ((next = map[pos])) {
    if (next.commit == commit) {
      if (next.from > to) break;
      from = Math.min(from, next.from);
      to = Math.max(to, next.to);
      map.splice(pos, 1);
    } else {
      if (next.from >= to) break;
      if (next.to > to) {
        map[pos] = new Span(to, next.to, next.commit);
        break;
      } else {
        map.splice(pos, 1);
      }
    }
  }

  map.splice(pos, 0, new Span(from, to, commit));
}
