const fragmentShader = `

precision highp float;
precision highp int;

// #define PI 3.14159
uniform float NUM_SIDES;
// uniform float NUM_SIDES;
uniform float time;
uniform vec2 Randomise_Fractal;

varying vec2 vUv;
  

const float PI = 3.14159265359;
// float KA = PI / NUM_SIDES;

void koleidoscope(inout vec2 uv)
{
  float angle = atan (uv.y, uv.x);
  angle = mod (angle, 2.0 * NUM_SIDES);
  angle = abs (angle - NUM_SIDES);
  angle += 0.1*time;
  float d = length(uv); 
  uv = d * vec2(cos(angle), sin(angle));
}

void smallKoleidoscope(inout vec2 uv)
{
  float angle = abs (mod (atan (uv.y, uv.x), 2.0 * NUM_SIDES) - NUM_SIDES) + 0.1 * time ;
  uv = length(uv) * vec2(cos(angle), sin(angle));
}
void main()
{
  vec2 uv = 12.0*(2.0 * vUv.xy  - 1.0);
//   uv.x += 2.*sin(2.*time);
      
//   koleidoscope(uv); 
  smallKoleidoscope(uv);
    
  vec3 p = vec3 (uv, Randomise_Fractal.x);
  for (int i = 0; i < 44; i++)
    p.xzy = vec3(1.3,0.999,0.678)*(abs((abs(p)/dot(p,p)-vec3(1.0,1.02,Randomise_Fractal.y*0.4))));
  
  gl_FragColor = vec4(p,1.0);
}
`;

export default fragmentShader;
