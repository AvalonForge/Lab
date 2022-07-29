import { Plugin, PluginKey, Transaction } from "prosemirror-state";
import { Transform, Step } from "prosemirror-transform";
import { EditorView } from "prosemirror-view";
import schema from "../prosemirror/schema";

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
    this.azimuth = azimuth;
    this.version = version;
    this.moments = moments;
    this.derivative = derivative ? derivative : 0;
  }

  wave(clock: Map<string, number>): Map<string, number> {
    console.log(this.version.keys());

    const timelines = new Set([...this.version.keys(), ...clock.keys()]);
    for (const timeline of timelines) {
      if (this.version.get(timeline) == undefined)
        this.version.set(timeline, 0);
    }
    console.log("timelines", timelines);

    // compose a vector that represents the last time documents were synced
    // the remainining moments will be sent from fromState
    const lastSync = new Map();
    timelines.forEach((timeline: string) => {
      if (
        this.version.get(timeline) == undefined ||
        clock.get(timeline) == undefined
      ) {
        lastSync.set(timeline, 0);
      } else {
        lastSync.set(
          timeline,
          Math.min(
            this.version.get(timeline) as number,
            clock.get(timeline) as number
          )
        );
      }
    });
    console.log("clock at last sync", lastSync);

    return lastSync;
  }

  static compareVersion(
    a: Map<string, number>,
    b: Map<string, number>
  ): boolean {
    const timelines = new Set([...a.keys(), ...b.keys()]);

    for (const timeline of timelines) {
      if (a.get(timeline) !== b.get(timeline)) return false;
    }
    return true;
  }

  // This expects all timelines known in clock to be known by the local state
  momentsSince(clock: Map<string, number>): Array<Moment> {
    const moments: Array<Moment> = [];
    const trackVersion = new Map(this.version);
    for (let i = this.moments.length - 1; i >= 0; i--) {
      if (ClockState.compareVersion(trackVersion, clock))
        return moments.reverse();
      if (
        trackVersion.get(this.moments[i].timeline) ===
        clock.get(this.moments[i].timeline)
      )
        continue;

      trackVersion.set(
        this.moments[i].timeline,
        (trackVersion.get(this.moments[i].timeline) as number) - 1
      );
      moments.push(this.moments[i]);
    }
    return moments
      .reverse()
      .map((moment: Moment) => moment.toStringify())
      .map((moment: string) => Moment.fromStrigify(moment));
  }

  stepBackTo(clock: Map<string, number>, tr?: Transform): Array<Moment> {
    const moments: Array<Moment> = [];
    while (!ClockState.compareVersion(this.version, clock)) {
      let moment;
      try {
        moment = this.moments.pop() as Moment;
        this.version.set(
          moment.timeline,
          (this.version as any).get(moment.timeline) - 1
        );
        moments.push(moment);
      } catch (error) {
        console.warn("at the end of the timeline", moment, error);
        return moments;
      }
      if (tr) {
        moment.inverts.reverse().forEach((invert) => {
          console.log("inverted", invert);
          tr.step(invert);
        });
      }
    }
    console.log("stepped back moments:", moments);
    return moments;
  }

  stepBack(tr?: Transaction): Moment | null {
    try {
      const moment = this.moments.pop() as Moment;
      console.log(moment);
      this.version.set(
        moment.timeline,
        (this.version as any).get(moment.timeline) - 1
      );
      if (tr) {
        moment.inverts.forEach((invert) => {
          tr.step(invert);
        });
        tr.setMeta("step-back", true);
      }
      return moment;
    } catch (error) {
      console.warn("at the end of the timeline");
      return null;
    }
  }

  stepForward(moment: Moment, tr?: Transform) {
    if (this.version.get(moment.timeline) == undefined) {
      this.version.set(moment.timeline, 0);
    }
    this.version.set(
      moment.timeline,
      (this.version.get(moment.timeline) as number) + 1
    );
    moment.version = this.version.get(moment.timeline) as number;

    if (tr) {
      moment.steps.forEach((step) => {
        tr.step(step);
      });
    }

    this.moments.push(moment);
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
    inverts: Array<Step>
  ) {
    this.version = version;
    this.steps = steps;
    this.inverts = inverts;
  }

  toStringify(): string {
    const json = {} as any;
    json.timeline = this.timeline;
    json.version = this.version;
    json.steps = this.steps.map((step) => step.toJSON());
    json.inverts = this.inverts.map((invert) => invert.toJSON());
    return JSON.stringify(json);
  }

  static fromStrigify(json: string): Moment {
    const res = JSON.parse(json);
    const steps = res.steps.map((step: any) =>
      Step.fromJSON(schema as any, step)
    );
    const inverts = res.inverts.map((invert: any) =>
      Step.fromJSON(schema as any, invert)
    );
    return new Moment(res.timeline, res.version, steps, inverts);
  }
}

export function getSync(fromState: ClockState, intoClock: Map<string, number>) {
  // calculate the last time the two clocks were equal
  const lastSync = fromState.wave(intoClock);

  // get the moments since fromState in each timeline
  const momentsSince = fromState.momentsSince(lastSync);
  console.log("moments since last sync", momentsSince, fromState.version);

  return { moments: momentsSince, lastSync: lastSync };
}

export function receiveSync(
  injectedMoments: Array<Moment>,
  intoView: EditorView,
  lastSync: Map<string, number>
) {
  //
  const localClock = ClockPluginKey.getState(intoView.state) as ClockState;
  console.log(
    "syncing: ",
    localClock.azimuth,
    " at version ",
    localClock.version,
    " from time ",
    lastSync
  );
  const tr = intoView.state.tr;

  // check that all timelines exist on this clock & initialize the onles that don't
  /*
  lastSync.forEach((version, timeline) => {
    if (localClock.version.get(timeline) == undefined) {
      localClock.version.set(timeline, 0);
    }
  });
  */

  // invert to last sync
  console.log("inverting moments");
  const invertedMoments = localClock.stepBackTo(lastSync, tr).reverse();
  const from = invertedMoments.reduce(
    (n, moment) => n + moment.inverts.length,
    0
  );
  /*
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
  */
  console.log(
    "inverted version:",
    localClock.version,
    " last sync: ",
    lastSync
  );
  console.log(
    "inverted moments:",
    invertedMoments,
    " injected moments",
    injectedMoments
  );

  // mesh moments
  let localOffset = 0;
  let remoteOffset = 0;
  const localMappings: Array<any> = [];
  const remoteMappings: Array<any> = [];
  let i = injectedMoments.length + invertedMoments.length;
  while (i > 0) {
    // select the priority timeline for conccurrent events
    if (
      injectedMoments[remoteOffset] &&
      (!invertedMoments[localOffset] ||
        injectedMoments[remoteOffset].timeline.charCodeAt(0) <
          invertedMoments[localOffset].timeline.charCodeAt(0))
    ) {
      // inject the remote moment
      const moment = injectedMoments[remoteOffset];
      console.log("Injecting remote moment", moment.steps);
      localClock.version.set(moment.timeline, moment.version);

      const mappedSteps: Array<Step> = [];
      const mappedInverts: Array<Step> = [];
      moment.steps.forEach((step: Step) => {
        //map step across local steps
        let mapped = step;
        //console.log("mapped", mapped);

        for (let j = 0; j < localMappings.length; j++) {
          if (localMappings[j] == null) continue;
          mapped = (mapped as any).map(localMappings[j]);
          if (!mapped) {
            break;
          }
        }
        console.log("mapped to:", mapped);

        //implment this mapped step
        // create a mapping for this step
        if (mapped && !tr.maybeStep(mapped).failed) {
          mappedSteps.push(mapped);
          mappedInverts.push(mapped.invert(tr.docs[tr.docs.length - 1]));
          const mapping = tr.mapping.slice(
            tr.steps.length - 1,
            tr.steps.length
          );
          remoteMappings.push(mapping);
        } else {
          console.error("mapping step failed:", step, mapped);
          if (mapped)
            console.log("failed to inject step:", tr.maybeStep(mapped));
        }
      });

      i--;
      remoteOffset++;
      moment.steps = mappedSteps;
      moment.inverts = mappedInverts;
      localClock.moments.push(moment);
    } else {
      // inject the local moment
      const moment = invertedMoments[localOffset];
      console.log("Injecting local moment", moment.steps);
      localClock.version.set(moment.timeline, moment.version);

      const mappedSteps: Array<Step> = [];
      const mappedInverts: Array<Step> = [];
      moment.steps.forEach((step) => {
        //map step across local steps
        console.log(
          from,
          localMappings.length,
          tr.mapping.slice(from - localMappings.length)
        );
        const mapped = step.map(tr.mapping.slice(from - localMappings.length));

        /*
        for (let j = 0; j < remoteMappings.length; j++) {
          console.log("applying remote mapping", remoteMappings[j]);
          mapped = (mapped as any).map(remoteMappings[j]);
          if (!mapped) {
            console.warn("breaking mapping", remoteMappings[j], step, moment);
            break;
          }
        }
        */
        console.log("mapped to:", mapped);

        //implment this mapped step
        // create a mapping for this step
        if (mapped && !tr.maybeStep(mapped).failed) {
          (tr.mapping as any).setMirror(
            from - localMappings.length,
            tr.steps.length - 1
          );

          mappedSteps.push(mapped);
          mappedInverts.push(mapped.invert(tr.docs[tr.docs.length - 1]));
          const mapping = tr.mapping.slice(
            tr.steps.length - moment.steps.length,
            tr.steps.length
          );
          localMappings.push(mapping);
          //remoteOffset++;
        } else {
          localMappings.push(null);
          console.error("mapping step failed:", step, mapped);
          if (mapped)
            console.log("failed to inject step:", tr.maybeStep(mapped));
        }
      });

      i--;
      localOffset++;
      moment.steps = mappedSteps;
      moment.inverts = mappedInverts;
      localClock.moments.push(moment);
    }
  }

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
      init: (_, state) => {
        return new ClockState(azimuth, version, moments, derivative);
      },
      apply(tr, state) {
        const newState = tr.getMeta(ClockPluginKey);
        if (newState) {
          return newState;
        }
        if (tr.docChanged) {
          console.log("doc changing transaction", tr);
          if (state.version.get(state.azimuth) == undefined) {
            state.version.set(state.azimuth, 0);
          } else {
            state.version.set(
              state.azimuth,
              (state.version.get(state.azimuth) as number) + 1
            );
          }

          if (tr.getMeta("step-back")) return state;

          const moment = new Moment(
            state.azimuth,
            state.version.get(state.azimuth) as number,
            tr.steps,
            tr.steps.map((step, i) => step.invert(tr.docs[i]))
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
