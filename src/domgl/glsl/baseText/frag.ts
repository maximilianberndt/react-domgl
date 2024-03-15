const frag = /* glsl */ `uniform vec3 uColor;

varying vec2 vUv;

void main() {
	gl_FragColor.rgb = uColor;
	gl_FragColor.a = 1.;
}`

export default frag
