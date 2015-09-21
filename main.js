function start() {
  var canvas = document.getElementById("glcanvas");
  var shaderScript = document.getElementById("shader");
  var gl = canvas.getContext("webgl");
  var glfx = new Glfx(gl);

  function reload() {
    try {
      glfx.programShader(shader.text);
      glfx.redraw();
      shaderScript.classList.remove("error");
    }
    catch (e) {
      shaderScript.classList.add("error");
    }
  }

  if (gl) {
    reload();
    shaderScript.oninput = reload;
  }
}
