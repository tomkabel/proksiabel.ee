#version 300 es
precision highp float;

in vec2 a_position;
in float a_size;
in vec3 a_color;
in float a_alpha;

uniform vec2 u_resolution;
uniform float u_time;

out vec3 v_color;
out float v_alpha;
out float v_pointSize;

void main() {
  vec2 zeroToOne = a_position / u_resolution;
  vec2 clipSpace = zeroToOne * 2.0 - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  gl_PointSize = a_size;
  v_color = a_color;
  v_alpha = a_alpha;
  v_pointSize = a_size;
}
