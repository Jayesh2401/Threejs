const fragmentShader = `

precision highp float;

varying vec2 vUv;
uniform float time;
uniform float speed;
uniform float fadeAway;
uniform vec3 color;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float uniformity;

void main(void) {
    float t = time * speed;
    vec2 position = (vUv.xy - resolution.xy * .5) / resolution.x;
    float angle = atan(position.y, position.x) / (2. * 3.14159265359);
    angle -= floor(angle);
    float rad = length(position);
    float angleFract = fract(angle * 256.);
    float angleRnd = floor(angle * 256.) + 1.;
    float angleRnd1 = fract(angleRnd * fract(angleRnd * .7235) * 45.1);
    float angleRnd2 = fract(angleRnd * fract(angleRnd * .82657) * 13.724);
    float t2 = t + angleRnd1 * uniformity;
    float radDist = sqrt(angleRnd2);
    float adist = radDist / rad * .1;
    float dist = (t2 * .1 + adist);
    dist = abs(fract(dist) - fadeAway);
    
    float outputColor = (1.0 / (dist)) * cos(0.7 * sin(t)) * adist / radDist / 30.0;
    angle = fract(angle + .61);
    gl_FragColor = vec4(outputColor * color, 1.0);
}
`;

export default fragmentShader;
