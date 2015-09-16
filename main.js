var gl; // A global variable for the WebGL context

function start() {
  var glcanvas = document.getElementById("glcanvas");
  var frag = document.getElementById("frag");

  function reload() {
    try {
      glfx.setup(frag.text);
      glfx.redraw();
      frag.classList.remove("error");
    }
    catch (e) {
      frag.classList.add("error");
    }
  }

  gl = glcanvas.getContext("webgl");
  
  if (gl) 
    reload();

  frag.oninput = reload;
}
