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

    this.program = buildProgram(fragShaderSrc, vertShaderSrc);
    gl.useProgram(this.program);
    loadVertices();
  };

  this.getUniformLocation = function (name) {
    return gl.getUniformLocation(this.program, name);
  };

  this.redraw = function () {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
}
