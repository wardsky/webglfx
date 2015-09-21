precision mediump float;

#define rgb(r, g, b) vec4(r, g, b, 1)

vec4 paint(float, float);

void main() {
  gl_FragColor = paint(gl_FragCoord.x, gl_FragCoord.y);
}

#line 1 1
