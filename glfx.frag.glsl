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
  vec4 result;
  result.rgb = 0.5 * (1.0 - sat) + sat * h(hue).rgb;
  result.a = 1.0;
  return result;
}

vec4 hsl(float hue, float sat, float lux) {
  vec4 result;
  result.rgb = (lux < 0.0) ? (1.0 + lux) * hs(hue, sat).rgb : 1.0 - (1.0 - lux) * (1.0 - hs(hue, sat).rgb);
  result.a = 1.0;
  return result;
}

vec4 hsla(float hue, float sat, float lux, float a) {
  vec4 result;
  result.rgb = hsl(hue, sat, lux).rgb;
  result.a = a;
  return result;
}

vec4 paint(float, float);

void main() {
  gl_FragColor = paint(gl_FragCoord.x, gl_FragCoord.y);
}

#line 1 1
