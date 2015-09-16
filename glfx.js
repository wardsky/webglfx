var glfx = {

  ATTR_VPOSITION: 0,

  program: null,

  compileShader: function (type, shaderStr) {
    var shader;

    shader = gl.createShader(type);
    gl.shaderSource(shader, shaderStr);
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

  buildProgram: function (fragShaderStr, vertShaderStr) {
    var fragShader, vertShader;

    fragShader = glfx.compileShader(gl.FRAGMENT_SHADER, fragShaderStr);
    vertShader = glfx.compileShader(gl.VERTEX_SHADER, vertShaderStr);
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

  setup: function (fragShaderStr) {
    const vertShaderStr = "attribute vec4 vPosition; void main() { gl_Position = vPosition; }";

    glfx.buildProgram(fragShaderStr, vertShaderStr);
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
