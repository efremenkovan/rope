uniform float playhead;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
	vUv = uv;
	vPosition = position;
	vNormal = (vec4(normal, 0.) * modelViewMatrix).xyz;
	gl_Position = projectionMatrix * modelViewMatrix*vec4(position, 1.0);
}