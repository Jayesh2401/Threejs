const fragmentShader = `

    uniform vec3 uDepthColor;
    uniform vec3 uSurfaceColor;
    uniform float uColorOffset;
    uniform float uColorMuliplier;

    varying float vElevation;


    void main(){
        float mixStrength = (vElevation + uColorOffset) * uColorMuliplier;
        vec3 color = mix(uDepthColor , uSurfaceColor , mixStrength );
        gl_FragColor = vec4(color,1.0);
    }
`;

export default fragmentShader;
