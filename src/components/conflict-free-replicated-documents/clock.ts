import { Plugin, PluginKey } from "prosemirror-state";

export const ClockPluginKey = new PluginKey("clock");

export class ClockState {
  azimuth: string;
  version: Map<string, number>;
  derivative: number;

  constructor(
    azimuth: string,
    version: Map<string, number>,
    derivative?: number
  ) {
    this.azimuth = azimuth;
    this.version = version;
    this.derivative = derivative ? derivative : 0;
  }
}

/**
 *  Azimuth is the urbit id of the user;
 *  Version is a vector clock mapping azimuth(*) => local version;
 *  Derivative is the number branch the user is currently editing; ex ~zod is the og, ~zod* is one divergence, ~zod** is two
 **/
export const clock = (
  azimuth: string,
  version: Map<string, number>,
  derivative?: number
) =>
  new Plugin({
    key: ClockPluginKey,
    state: {
      init: () => new ClockState(azimuth, version, derivative),
      apply(tr, state) {},
    },
  });
