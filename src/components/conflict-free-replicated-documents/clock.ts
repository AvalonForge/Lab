import { Plugin, PluginKey } from "prosemirror-state";
import { Transform, Step } from "prosemirror-transform";
import { EditorView } from "prosemirror-view";

export const ClockPluginKey = new PluginKey("clock");

export class ClockState {
  azimuth: string;
  version: Map<string, number>;
  moments: Array<Moment>;
  derivative: number;

  constructor(
    azimuth: string,
    version: Map<string, number>,
    moments: Array<Moment>,
    derivative?: number
  ) {
    console.log(version);
    this.azimuth = azimuth;
    this.version = version;
    this.moments = moments;
    this.derivative = derivative ? derivative : 0;
  }
}

export class Moment {
  version: number;
  steps: Array<Step>;
  inverts: Array<Step>;

  constructor(
    readonly timeline: string,
    version: number,
    steps: Array<Step>,
    inverts: Array<Step>,
    readonly origin: Transform
  ) {
    this.version = version;
    this.steps = steps;
    this.inverts = inverts;
  }
}

export function syncFrom(
  fromState: ClockState,
  intoClock: Map<string, number>
) {
  const fromClock = fromState.version;

  //create a set of all known timelines; should be in revere order
  const timelines = new Set(
    [...Array.from(fromClock.keys()), ...Array.from(intoClock.keys())].sort(
      (a, b) => a.charCodeAt(0) - b.charCodeAt(0)
    )
  );
  console.log("timelines", timelines);

  // compose a vector that represents the last time documents were synced
  // the remainining moments will be sent from fromState
  const lastSync = new Map();
  timelines.forEach((timeline: string) => {
    if (
      fromClock.get(timeline) == undefined ||
      intoClock.get(timeline) == undefined
    ) {
      lastSync.set(timeline, 0);
    } else {
      lastSync.set(
        timeline,
        Math.min(
          fromClock.get(timeline) as number,
          intoClock.get(timeline) as number
        )
      );
    }
  });
  console.log("clock at last sync", lastSync);

  // get the moments since fromState in each timeline
  const momentsSince: Array<Moment> = [];
  timelines.forEach((timeline: string) => {
    fromState.moments.forEach((moment) => {
      if (
        moment.timeline == timeline &&
        moment.version > lastSync.get(timeline)
      )
        momentsSince.push(moment);
    });
  });
  console.log("moments since last sync", momentsSince);

  return { moments: momentsSince, lastSync: lastSync };
}

export function syncInto(
  injectedMoments: Array<Moment>,
  intoView: EditorView,
  lastSync: Map<string, number>
) {
  //
  const localClock = ClockPluginKey.getState(intoView.state) as ClockState;
  const tr = intoView.state.tr;

  // check that all timelines exist on this clock & initialize the onles that don't
  lastSync.forEach((version, timeline) => {
    if (localClock.version.get(timeline) == undefined) {
      localClock.version.set(timeline, 0);
    }
  });

  // invert to last sync
  let found = false;
  let from = 0;
  const invertedMoments = [];
  while (localClock.moments.length > 0 && !found) {
    const moment = localClock.moments.pop() as Moment;
    if (moment.version == lastSync.get(moment.timeline)) {
      localClock.moments.push(moment);
      found = true;
    } else {
      localClock.version.set(moment.timeline, moment.version - 1);
      invertedMoments.push(moment);
      moment.inverts.forEach((invert) => {
        from++;
        tr.step(invert);
      });
    }
  }
  invertedMoments.reverse().forEach((moment) => {
    Object.assign(moment, { inverted: true });
    injectedMoments.push(moment);
  });
  console.log("inverted version:", localClock.version);
  console.log("inverted moments:", localClock.moments);
  console.log("new injected moments:", injectedMoments);

  //inject new moments
  let syncedMapTo = from;
  let unsyncedMapTo = from;
  lastSync.forEach((version, timeline) => {
    console.log("timeline", timeline);
    let i = 0;
    injectedMoments.forEach((moment) => {
      if (moment.timeline == timeline) {
        //console.log("injecting moment", moment);
        localClock.version.set(
          timeline,
          (localClock.version.get(timeline) as number) + 1
        );
        moment.version = localClock.version.get(timeline) as number;
        const mappedSteps: Array<Step> = [];
        const mappedInverts: Array<Step> = [];
        moment.steps.forEach((step) => {
          //console.log("applying step:", step);
          const mapped = step.map(
            tr.mapping.slice(
              from,
              (moment as any).inverted ? unsyncedMapTo : syncedMapTo
            )
          );
          (moment as any).inverted ? syncedMapTo++ : unsyncedMapTo++;
          if (mapped) {
            mappedSteps.push(mapped);
            console.log(tr, mapped);
            tr.step(mapped);
            mappedInverts.push(mapped.invert(tr.docs[tr.docs.length - 1]));
            i++;
          } else {
            console.log("mapping step failed:", step, mapped);
            if (mapped)
              console.log("failed to inject step:", tr.maybeStep(mapped));
          }
        });
        moment.steps = mappedSteps;
        moment.inverts = mappedInverts;
        (moment as any).inverted = undefined;
        localClock.moments.push(moment);
      }
    });
  });

  tr.setMeta("addToHistory", false).setMeta(ClockPluginKey, localClock);
  intoView.dispatch(tr);
}

/**
 *  Azimuth is the urbit id of the user;
 *  Version is a vector clock mapping azimuth(*) => local version;
 *  Derivative is the number branch the user is currently editing; ex ~zod is the og, ~zod* is one divergence, ~zod** is two
 **/
export const clock = (
  azimuth: string,
  version: Map<string, number>,
  moments: Array<Moment>,
  derivative?: number
) =>
  new Plugin({
    key: ClockPluginKey,
    state: {
      init: () => new ClockState(azimuth, version, moments, derivative),
      apply(tr, state) {
        const newState = tr.getMeta(ClockPluginKey);
        if (newState) {
          console.log("applying new state", tr);
          return newState;
        }
        if (tr.docChanged) {
          console.log("doc changing transaction", tr);
          if (state.version.get(state.azimuth) == undefined) {
            console.log("initializing this timeline");
            state.version.set(state.azimuth, 0);
          } else {
            state.version.set(
              state.azimuth,
              state.version.get(state.azimuth) + 1
            );
          }

          const moment = new Moment(
            state.azimuth,
            state.version.get(state.azimuth),
            tr.steps,
            tr.steps.map((step, i) => step.invert(tr.docs[i])),
            tr
          );
          state.moments.push(moment);
          return new ClockState(
            state.azimuth,
            state.version,
            state.moments,
            state.derivative
          );
        }
        return state;
      },
    },
  });
