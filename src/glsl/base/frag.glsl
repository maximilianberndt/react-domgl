uniform vec3 uColor;

uniform vec2 uImageSizes;
uniform vec2 uPlaneSizes;
uniform highp sampler2D tMap;

varying vec2 vUv;

void main() {
    vec2 ratio = vec2(
			min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
			min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
    );

    vec2 uv = vec2(
			vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
			vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec4 color = texture2D(tMap, uv); 


	gl_FragColor.rgb = color.rgb;
	gl_FragColor.a = 1.;
}