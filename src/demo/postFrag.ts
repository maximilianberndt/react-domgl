const postFrag = /* glsl */ `
precision highp float;

uniform sampler2D tMap;
uniform sampler2D tFlow;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
    // R and G values are velocity in the x and y direction
    // B value is the velocity length
    vec3 flow = texture2D(tFlow, vUv).rgb;
    
    // Use flow to adjust the uv lookup of a texture
    vec2 uv = vUv;
    vec2 direction = (uv - 0.5) * 2. * flow.b;
    
	float r = texture2D(tMap, uv - flow.xy * direction * 0.2 ).r;
	float g = texture2D(tMap, uv - flow.xy * direction * 0.3).g;
	float b = texture2D(tMap, uv - flow.xy * direction * 0.25).b;

	gl_FragColor.rgb = vec3(r, g, b);
	gl_FragColor.a = 1.0;
}
`

export default postFrag
