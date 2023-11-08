import * as THREE from 'three';

function Testone() {
  if (THREE.WebGLRenderer) {
    // WebGL is available, do some initialization here
    // console.log("here first")
  } else {
    // WebGL is not available, show an error message
    const warning = 'WebGL is not supported on this device.';
    return <h1 id="containerH1">{warning}</h1>;
  }
}

function animate() {
  // Your animation code goes here
}

export default Testone;
