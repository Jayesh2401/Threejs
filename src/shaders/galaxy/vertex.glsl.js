const vertexShader = `

uniform float uSize;
uniform float uTime;
attribute float aScale;
attribute vec3 aRandomness;
varying vec3 vColor;


void main() {



    vec4 modelPosition = modelMatrix * vec4(position , 1.0);

    float angle = atan(modelPosition.x , modelPosition.z);
    float ditancetoCenter = length(modelPosition.xz);
    float offsetAngle =(1.0 / ditancetoCenter) * uTime * 0.2;
    angle += offsetAngle;
    modelPosition.x = cos(angle) * ditancetoCenter ;
    modelPosition.z = sin(angle) * ditancetoCenter;

    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / -  viewPosition.z);

    vColor = color;


}

`;

export default vertexShader;
