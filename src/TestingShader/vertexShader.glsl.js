const vertexShader = `
precision highp float;
precision highp int;

// uniform mat4 modelMatrix;
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;

// uniform float time;

// attribute vec3 position;

varying vec2 vUv;

void main() {

    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
`;

export default vertexShader;
