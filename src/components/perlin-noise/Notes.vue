<template>
    <aside>
        <h3>Notes</h3>
        <p>
            This is a prototype of a gradient generating script for making noise in UIs a little less noisy.
            This uses perlin noise which creates a more pleasant noise by interpolating between points.
            Our particluar implementation creates a stack of curves to span x & y directions along with other parameters seen below. 
        </p>
      <!-- Generate Button -->
      <div class="">
        <button type="button" @click="start">generate</button>
      </div>

      <!-- Hue Range -->
      <div class="flex">
        <strong class="flex-1">Hue:</strong>
        <div class="flex-1">Seed: {{ hseed }}</div>
        <input
          type="range"
          v-model="hseed"
          min="0"
          max="360"
          class="flex-1 mx-12"
        />
        <div class="flex-1">Radius: {{ hradius }}</div>
        <input
          type="range"
          v-model="hradius"
          min="0"
          max="3600"
          class="flex-1 mx-12"
        />
      </div>

      <!-- Saturation Range -->
      <div class="flex">
        <strong class="flex-1">Saturation:</strong>
        <div class="flex-1">Center: {{ scenter }}</div>
        <input
          type="range"
          v-model="scenter"
          min="0"
          max="99"
          class="flex-1 mx-12"
        />
        <div class="flex-1">Radius: {{ sradius }}</div>
        <input
          type="range"
          v-model="sradius"
          min="0"
          :max="100"
          class="flex-1 mx-12"
        />
      </div>

      <!-- Luminosity Range -->
      <div class="flex">
        <strong class="flex-1">Luminosity:</strong>
        <div class="flex-1">Center: {{ lcenter }}</div>
        <input
          type="range"
          v-model="lcenter"
          min="0"
          max="99"
          class="flex-1 mx-12"
        />
        <div class="flex-1">Radius: {{ lradius }}</div>
        <input
          type="range"
          v-model="lradius"
          min="0"
          :max="100"
          class="flex-1 mx-12"
        />
      </div>

      <!-- Alpha Range -->
      <div class="flex">
        <strong class="flex-1">Alpha:</strong>
        <div class="flex-1">Center: {{ acenter }}</div>
        <input
          type="range"
          v-model="acenter"
          min="0"
          max="99"
          class="flex-1 mx-12"
        />
        <div class="flex-1">Radius: {{ aradius }}</div>
        <input
          type="range"
          v-model="aradius"
          min="0"
          :max="100"
          class="flex-1 mx-12"
        />
      </div>

      <!-- Resolution -->
      <div class="flex">
        <strong
          :style="{ 'flex-grow': '1', 'flex-basis': '0', 'flex-shrink': '1' }"
          >Size:</strong
        >
        <input
          type="number"
          v-model="artboardSize"
          class="bg-none hover:bg-warm focus:bg-cool outline-none 12 min-w-0"
          :style="{ 'flex-grow': '4', 'flex-basis': '0', 'flex-shrink': '4' }"
        />
      </div>

      <!-- Resolution -->
      <div class="flex">
        <strong
          :style="{ 'flex-grow': '1', 'flex-basis': '0', 'flex-shrink': '1' }"
          >Resolution:</strong
        >
        <input
          type="number"
          v-model="resolution"
          class="bg-none hover:bg-warm focus:bg-cool outline-none 12 min-w-0"
          :style="{ 'flex-grow': '4', 'flex-basis': '0', 'flex-shrink': '4' }"
        />
      </div>

      <!-- Shape -->
      <div class="flex">
        <strong
          :style="{ 'flex-grow': '1', 'flex-basis': '0', 'flex-shrink': '1' }"
          >Pixel Shape:</strong
        >
        <select
          v-model="shape"
          class="bg-none hover:bg-warm focus:bg-cool outline-none min-w-0"
          :style="{ 'flex-grow': '4', 'flex-basis': '0', 'flex-shrink': '4' }"
        >
          <option value="square">square</option>
          <option value="dot">dot</option>
        </select>
      </div>

      <!-- Smooth Function -->
      <div class="flex">
        <strong :style="{ 'flex-grow': '1', 'flex-basis': 0 }"
          >Smoothing Function:</strong
        >
        <div class="mx-12" :style="{ 'flex-grow': '4', 'flex-basis': 0 }">
          ax^d + bx^e + cx^f
        </div>
      </div>

      <!-- d=5 -->
      <div class="flex">
        <div class="flex-1"></div>
        <div class="flex-1">a:</div>
        <input
          type="number"
          class="bg-none hover:bg-warm focus:bg-cool outline-none mx-12 min-w-0 flex-1"
          v-model="a"
        />
        <div class="flex-1">d:</div>
        <input
          type="number"
          class="bg-none hover:bg-warm focus:bg-cool outline-none mx-12 min-w-0 flex-1"
          v-model="d"
        />
      </div>

      <!-- d=4 -->
      <div class="flex">
        <div class="flex-1"></div>
        <div class="flex-1">b:</div>
        <input
          type="number"
          class="bg-none hover:bg-warm focus:bg-cool outline-none mx-12 min-w-0 flex-1"
          v-model="b"
        />
        <div class="flex-1">e:</div>
        <input
          type="number"
          class="bg-none hover:bg-warm focus:bg-cool outline-none mx-12 min-w-0 flex-1"
          v-model="e"
        />
      </div>

      <!-- d=3 -->
      <div class="flex">
        <div class="flex-1"></div>
        <div class="flex-1">c:</div>
        <input
          type="number"
          class="bg-none hover:bg-warm focus:bg-cool outline-none mx-12 min-w-0 flex-1"
          v-model="c"
        />
        <div class="flex-1">f:</div>
        <input
          type="number"
          class="bg-none hover:bg-warm focus:bg-cool outline-none mx-12 min-w-0 flex-1"
          v-model="f"
        />
      </div>
    </aside>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "Notes",
    props: {
        canvas: {
            required: true,
        }
    },
    data() {
        const artboardSize = 1280;
        const resolution = 64;
        const seedHue = 300;
        return {
          shape: "dot",
          artboardSize: artboardSize,
          artboard: null as any,
          interval: null as any,
          resolution: resolution,
          colorScale: 100,
          gradients: {} as any,
          memory: {} as any,
          a: 6,
          b: -15,
          c: 10,
          d: 5,
          e: 4,
          f: 3,
          hseed: 180,
          hradius: 360,
          lcenter: 0,
          lradius: 0,
          scenter: 99,
          sradius: 1,
          acenter: 80,
          aradius: 100,
        };
      },
      mounted: function () {
        if(this.canvas != null) {
            this.artboard = (this.canvas as any).getContext("2d");
            this.artboard.fillStyle = "#262626";
        }
      },
      watch: {
        artboardSize: function(newSize: number) {
            this.$emit("update-size", newSize);
        },
        canvas: function(newCanvas: any) {
            if(this.canvas != null) {
                this.artboard = (this.canvas as any).getContext("2d");
                this.artboard.fillStyle = "#262626";
            }
        }
      },
      methods: {
        start: function () {
          this.gradients = {};
          this.memory = {};
          //this.interval = setInterval(() => {
          this.artboard.clearRect(0, 0, this.artboardSize, this.artboardSize);
          this.draw();
          //}, 1000);
        },
        draw: function (): any {
          const pixelSize = this.artboardSize / this.resolution;
          const numPixels = 1 / this.resolution;
          for (let y = 0; y < 1; y += numPixels) {
            for (let x = 0; x < 1; x += numPixels) {
              const h =
                this.getPerlin("h", x, y) * Number(2 * this.hradius) +
                Number(this.hseed) -
                (-Number(this.hradius) % 360);
              const s =
                this.getPerlin("s", x, y) * Number(2 * this.sradius) +
                Number(this.scenter) -
                Number(this.sradius);
              let l =
                this.getPerlin("l", x, y) * Number(2 * this.lradius) +
                Number(this.lcenter) -
                Number(this.lradius);
              let a =
                this.getPerlin("a", x, y) * Number(2 * this.aradius) +
                Number(this.acenter) -
                Number(this.aradius);
              this.artboard.fillStyle = `hsl(${h}, ${s}%, ${l}%, ${a / 100})`;
              if (this.shape == "dot") {
                this.artboard.beginPath();
                this.artboard.arc(
                  x * this.artboardSize,
                  y * this.artboardSize,
                  pixelSize * 0.3,
                  0,
                  2 * Math.PI,
                  false
                );
                this.artboard.fill();
              } else {
                this.artboard.fillRect(
                  x * this.artboardSize,
                  y * this.artboardSize,
                  pixelSize,
                  pixelSize
                );
              }
            }
          }
        },
        getPerlin: function (n: string, x: number, y: number) {
          if (!this.memory[n]) this.memory[n] = {};
          if (this.memory[n][x] && this.memory[n][x][y])
            return this.memory[n][x][y];
          if (!this.memory[n][x]) this.memory[n][x] = {};
          let xf = Math.floor(x);
          let yf = Math.floor(y);
          //interpolate
          let tl = this.dotProductGrid(n, x, y, xf, yf);
          let tr = this.dotProductGrid(n, x, y, xf + 1, yf);
          let bl = this.dotProductGrid(n, x, y, xf, yf + 1);
          let br = this.dotProductGrid(n, x, y, xf + 1, yf + 1);
          let xt = this.interpolate(x - xf, tl, tr);
          let xb = this.interpolate(x - xf, bl, br);
          let v = Math.abs(this.interpolate(y - yf, xt, xb));
          this.memory[n][x][y] = v;
          return v;
        },
        dotProductGrid: function (
          n: string,
          x: number,
          y: number,
          vx: number,
          vy: number
        ) {
          let g_vect;
          let d_vect = { x: x - vx, y: y - vy };
          if (!this.gradients[n]) this.gradients[n] = {};
          if (!this.gradients[n][vx]) this.gradients[n][vx] = {};
          if (this.gradients[n][vx] && this.gradients[n][vx][vy]) {
            g_vect = this.gradients[n][vx][vy];
          } else {
            g_vect = this.getRandomVector();
            this.gradients[n][vx][vy] = g_vect;
          }
          return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
        },
        smoothStep: function (x: number) {
          return this.a * x ** this.d + this.b * x ** this.e + this.c * x ** this.f;
        },
        interpolate: function (x: number, a: number, b: number) {
          return a + this.smoothStep(x) * (b - a);
        },
        getRandomVector: function () {
          let theta = Math.random() * 2 * Math.PI;
          return { x: Math.cos(theta), y: Math.sin(theta) };
        },
   },
})
</script>