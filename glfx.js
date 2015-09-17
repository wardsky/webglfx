var glfx = {

  ATTR_VPOSITION: 0,

  program: null,

  compileShader: function (type, shaderSrc) {
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
  },

  linkProgram: function (fragShader, vertShader) {
    glfx.program = gl.createProgram();
    gl.attachShader(glfx.program, fragShader);
    gl.attachShader(glfx.program, vertShader);
    gl.bindAttribLocation(glfx.program, glfx.ATTR_VPOSITION, "vPosition");
    gl.linkProgram(glfx.program);

    if (!gl.getProgramParameter(glfx.program, gl.LINK_STATUS))
      throw "Failed to link program";
  },

  buildProgram: function (fragShaderSrc, vertShaderSrc) {
    var fragShader, vertShader;

    fragShader = glfx.compileShader(gl.FRAGMENT_SHADER, fragShaderSrc);
    vertShader = glfx.compileShader(gl.VERTEX_SHADER, vertShaderSrc);
    glfx.linkProgram(fragShader, vertShader);
  },

  loadVertices: function () {
    const vertices = [ -1.0, -1.0, 0.1,
                       -1.0, +1.0, 0.1,
                       +1.0, -1.0, 0.1,
                       +1.0, +1,0, 0.1 ];
    var buffer;
    
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(glfx.ATTR_VPOSITION, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(glfx.ATTR_VPOSITION);
  },

  setup: function (shaderStr) {

    const fragShaderSrc = [
      "#line 1 0",
      "precision mediump float;",
      "#define rgb(r, g, b) vec4(r, g, b, 1)",
      "vec4 paint(float, float);",
      "void main() { gl_FragColor = paint(gl_FragCoord.x, gl_FragCoord.y); }",
      "#line 1 1",
      shaderStr
    ].join('\n');

    const vertShaderSrc = [
      "attribute vec4 vPosition;",
      "void main() { gl_Position = vPosition; }"
    ].join('\n');

    glfx.buildProgram(fragShaderSrc, vertShaderSrc);
    gl.useProgram(glfx.program);
    glfx.loadVertices();
  },

  getUniformLocation: function (name) {
    return gl.getUniformLocation(glfx.program, name);
  },

  redraw: function () {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
};
