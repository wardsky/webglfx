function Glfx(gl) {

  const ATTR_VPOSITION = 0;

  function compileShader(type, shaderSrc) {
    var shader;

    shader = gl.createShader(type);
    gl.shaderSource(shader, shaderSrc);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(shader));
      switch (type) {
        case gl.FRAGMENT_SHADER:
          throw "Failed to compile fragment shader";
        case gl.VERTEX_SHADER:
          throw "Failed to compile vertex shader";
      }
    }

    return shader;
  }

  function linkProgram(fragShader, vertShader) {
    var program = gl.createProgram();
    
    gl.attachShader(program, fragShader);
    gl.attachShader(program, vertShader);
    gl.bindAttribLocation(program, ATTR_VPOSITION, "vPosition");
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw "Failed to link program";
    
    return program;
  }

  function buildProgram(fragShaderSrc, vertShaderSrc) {
    var fragShader, vertShader;

    fragShader = compileShader(gl.FRAGMENT_SHADER, fragShaderSrc);
    vertShader = compileShader(gl.VERTEX_SHADER, vertShaderSrc);

    return linkProgram(fragShader, vertShader);
  }

  function loadVertices() {
    const vertices = [ -1.0, -1.0, 0.1,
                       -1.0, +1.0, 0.1,
                       +1.0, -1.0, 0.1,
                       +1.0, +1,0, 0.1 ];
    var buffer;
    
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(ATTR_VPOSITION, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ATTR_VPOSITION);
  }

  this.programShader = function (shaderStr) {
    const fragShaderSrc = "precision mediump float;\n\n#define TWO_PI 6.283185307179586\n\n#define rgb(r, g, b) vec4(r, g, b, 1)\n\nfloat hcomp(float ang) {\n  return clamp(abs((6.0 * mod(ang, TWO_PI) / TWO_PI) - 3.0) - 1.0, 0.0, 1.0);\n}\n\nvec4 h(float hue) {\n  float off = TWO_PI / 3.0;\n  return rgb(hcomp(hue), hcomp(hue - off), hcomp(hue - 2.0 * off));\n}\n\nvec4 hs(float hue, float sat) {\n  return vec4(0.5 * (1.0 - sat) + sat * h(hue).rgb, 1.0);\n}\n\nvec4 hsl(float hue, float sat, float lux) {\n  float val = fract(lux);\n  vec3 col = hs(hue, sat).rgb;\n  return vec4(lux < 0.0 ? val * col : 1.0 - (1.0 - val) * (1.0 - col), 1.0);\n}\n\nvec4 hsla(float hue, float sat, float lux, float a) {\n  return vec4(hsl(hue, sat, lux).rgb, a);\n}\n\nvec4 paint(float, float);\n\nvoid main() {\n  gl_FragColor = paint(gl_FragCoord.x, gl_FragCoord.y);\n}\n\n#line 1 1\n" + shaderStr;
    const vertShaderSrc = "attribute vec4 vPosition;\n\nvoid main() {\n  gl_Position = vPosition;\n}\n";

    this.program = buildProgram(fragShaderSrc, vertShaderSrc);
    gl.useProgram(this.program);

    this.uniformDirectory = {};

    loadVertices();
  };

  this.bindUniform = function (name, type, binding) {
    var loc = gl.getUniformLocation(this.program, name);
    if (loc) {
      this.uniformDirectory[name] = {
        loc: loc,
        type: type,
        binding: binding
      };
    }
  };

  this.updateUniforms = function () {
    for (var name in this.uniformDirectory) {
      var uniform = this.uniformDirectory[name];
      switch (uniform.type) {
      case gl.FLOAT:
        gl.uniform1f(uniform.loc, uniform.binding());
      }
    }
  };

  this.redraw = function () {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
}
