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
  constructor(
    readonly timeline: string,
    readonly version: number,
    readonly steps: Array<Step>,
    readonly inverts: Array<Step>,
    readonly origin: Transform
  ) {}
}

export function syncFrom(
  fromState: ClockState,
  intoVector: Map<string, number>
) {
  const diffs = new Map();
  fromState.version.forEach((version, timeline) => {
    const intoVersion = intoVector.get(timeline);
    if (intoVersion == undefined) diffs.set(timeline, version);
    else diffs.set(timeline, version - intoVersion);
  });
  console.log(diffs);
  const moments = [];
  diffs.forEach((diff, timeline) => {
    let i = diff;
    let j = 0;
    const fromMoments = fromState.moments;
    while (i > 0) {
      if (fromMoments[j].timeline == timeline) {
        moments.push(fromMoments[j]);
        i--;
      }
      j++;
    }
  });
  console.log(moments);
  return moments;
}

export function syncInto(fromMoments: Array<Moment>, intoView: EditorView) {
  //
  fromMoments.forEach((moment: Moment) => {
    const localClock = ClockPluginKey.getState(intoView.state) as ClockState;
    const momentsToRebase = [];
    const version = localClock.version;
    /*
    let i = 0;
    const localMoments = localClock.moments;
    while (i < localMoments.length && !found) {
      if (localMoments[i].timeline == moment.timeline) {
        found = true;
        version.set(moment.timeline, moment.version);
      } else momentsToRebase.push(localMoments[i]);
      i++;
    }
    console.log(momentsToRebase);
    */
    const tr = intoView.state.tr;
    const rebased = [];

    // inverting moments that came after our injected moment
    let found = false;
    for (let i = localClock.moments.length - 1; i >= 0 && !found; i--) {
      console.log("inverting", localClock.moments[i]);
      if (localClock.moments[i].timeline == moment.timeline) {
        found = true;
      } else {
        rebased.push(localClock.moments.pop());
        localClock.moments[i].inverts.reverse().forEach((invert) => {
          tr.step(invert);
          // deletle moments
        });
      }
    }
    console.log("completed inversion", tr);

    // injecting the remote moment
    localClock.moments.push(moment);
    moment.steps.forEach((step) => {
      tr.step(step);
    });
    console.log("completed injection", tr);

    // reapply our moments
    rebased.reverse().forEach((rebasedMoment) => {
      rebasedMoment.steps.forEach((step) => {
        console.log("mapping", tr.mapping);
        //const mapped = step.map(tr.mapping())
      });
    });

    console.log("completed reordering");

    const newClockState = new ClockState(
      localClock.azimuth,
      version,
      rebased,
      localClock.derivative
    );
    tr.setMeta("addToHistory", false).setMeta(ClockPluginKey, newClockState);
    console.log(tr);
    intoView.dispatch(tr);
  });
}

export function rebaseMoment(
  moments: readonly Moment[],
  injecting: Moment,
  transform: Transform
) {
  /*
  const result = [];
  for (let i = 0, mapFrom = moments.length; i < moments.length; i++) {
    moments[i].steps.reverse()
    const mapped = moments[i].steps.map((step) =>
      step.map(transform.mapping.slice(mapFrom))
    );
    mapFrom--;
    if (mapped && !transform.maybeStep(mapped).failed) {
      console.log(transform.mapping);
      //transform.mapping.setMirror(mapFrom, transform.steps.length - 1)
      result.push(
        new Moment(
          moments[i].timeline,
          moments[i].version,
          mapped,
          mapped.map((step) =>
            step.invert(transform.docs[transform.docs.length - 1])
          ),
          moments[i].origin
        )
      );
    }
  }
  console.log(result);
  return result;
  */
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
