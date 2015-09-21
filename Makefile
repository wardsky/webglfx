glfx.js: glfx.src.js glfx.frag.glsl glfx.vert.glsl
	./utils/inject $< >$@
