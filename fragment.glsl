uniform float playhead;
uniform vec3 colors[5]; 

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

float getIndex(float value, float index) {
	return step(value, index/5.) - step(value, (index - 1.) / 5.);
} 

vec3 getColor(float value) {
	return colors[0]*getIndex(value, 1.0)
		+ colors[1]*getIndex(value, 2.0)
		+ colors[2]*getIndex(value, 3.0)
		+ colors[3]*getIndex(value, 4.0)
		+ colors[4]*getIndex(value, 5.0);
}

void main() {
	float light = clamp(dot(vec3(0.,0.5,0.), -vNormal), 0., 1.);
	gl_FragColor = vec4(vec3(getColor(fract(vUv.y*3. - playhead * 2.))) + vec3(light) * 0.6,1.);
	// gl_FragColor = vec4(vUv, 0., 1.0);
}