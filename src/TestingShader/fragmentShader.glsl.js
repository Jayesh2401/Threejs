const fragmentShader = `
#define TAU 6.28318530718
#define MAX_ITER 5

precision highp float;
precision highp int;

uniform float time;
// uniform vec3 waterColor = vec3(0.0, 0.5, 1.0);
uniform vec3 waterColor ;
vec3 farWaterColor = vec3(0.5686,0.6705,0.7607);
vec3 wavesColor = vec3(1.0,1.0,1.0);
float farDistance = 0.9;
vec2 resolution = vec2(1.0,1.0);
vec2 waveResolution = vec2(3.0,3.0);
float repeat = 2.0;
float brightness = 0.7;
float speed = 0.1;
float opacity = 0.9;

// Example varyings passed from the vertex shader
varying vec2 vUv;

void main() {
    // difuminado radial ..........................................................................................
    vec2 pos_ndc = 2.0 * vUv.xy / resolution.xy - 1.0;
    float dist = length(pos_ndc);
    vec3 backgroundColor = mix(waterColor, farWaterColor, smoothstep(0.0, farDistance, dist));
    // ............................................................................................................
    
    // waves ........................................................................................................
    vec2 uv = vUv * waveResolution;
    vec2 p = mod(uv * TAU, TAU) - 250.0;
    vec2 i = vec2(p);
        
    float c = 1.0;
    float inten = 0.005;
    
    for ( int n = 0; n < MAX_ITER; n++ )  {
        float t = speed * time * (1.0 - (3.0 / float(n + 1)));
        i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x)) * repeat;
        c += 1.0 / length(vec2(p.x / (sin(i.x + t) / inten), p.y / (cos(i.y + t) / inten)));
    }
    
    c /= float( MAX_ITER  );
    c = 1.17 - pow( c, brightness );
    
    vec3 rgb = vec3( pow( abs( c ), 8.0 ) );
    // ..............................................................................................................
    
    //vec3 backColorWater = vec3( rgb * color + backgroundColor);
    vec3 color = vec3(rgb * wavesColor + backgroundColor);
    gl_FragColor = vec4( color, opacity);

}`;
export default fragmentShader;
