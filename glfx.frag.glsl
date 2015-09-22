precision mediump float;

#define TWO_PI 6.283185307179586

#define rgb(r, g, b) vec4(r, g, b, 1)

float hcomp(float ang) {
  return clamp(abs((6.0 * mod(ang, TWO_PI) / TWO_PI) - 3.0) - 1.0, 0.0, 1.0);
}

vec4 h(float hue) {
  float off = TWO_PI / 3.0;
  return rgb(hcomp(hue), hcomp(hue - off), hcomp(hue - 2.0 * off));
}

vec4 hs(float hue, float sat) {
  return vec4(0.5 * (1.0 - sat) + sat * h(hue).rgb, 1.0);
}

vec4 hsl(float hue, float sat, float lux) {
  float val = fract(lux);
  vec3 col = hs(hue, sat).rgb;
  return vec4(lux < 0.0 ? val * col : 1.0 - (1.0 - val) * (1.0 - col), 1.0);
}

vec4 hsla(float hue, float sat, float lux, float a) {
  return vec4(hsl(hue, sat, lux).rgb, a);
}

vec4 paint(float, float);

void main() {
  gl_FragColor = paint(gl_FragCoord.x, gl_FragCoord.y);
}

#line 1 1
