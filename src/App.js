import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">

    <h1 style={{display:"flex" , justifyContent:"center" , margin:"auto" }}>Three js Journey</h1>
      <div className="linkList">
      <Link to="/FirstDemo" target="_blank"> First 3D cube</Link>
        <Link to="/Second" target="_blank"> First Hover cube</Link>
        <Link to="/Fourth" target="_blank"> Fourth</Link>
        <Link to="/SmileyEmoji" target="_blank"> Smiley-Emoji</Link>
        <Link to="/Sixth" target="_blank"> First 3D phoenix bird </Link>
        <Link to="/Seventh" target="_blank"> Shadow and animation</Link>
        <Link to="/SunEarth" target="_blank"> Solar system</Link>
        <Link to="/GLTFLoaderDemo" target="_blank">GLTFLoaderDemo first animation</Link>
        <Link to="/Tenth" target="_blank"> Geometry Scenary</Link>
        <Link to="/Eleventh" target="_blank">Wooden floor & robot</Link>
        <Link to="/River" target="_blank">River Scene classic</Link>
        <Link to="/House" target="_blank"> House</Link>
        <Link to="/Soldier" target="_blank"> Soldier</Link>
        <Link to="/Skeleton" target="_blank"> Skeleton Learning</Link>
        <Link to="/Mind" target="_blank"> Room demo</Link>
        <Link to="/Refle" target="_blank"> Reflection shadow</Link>
      </div>
      <div className="linkList">
        <Link to="/Mirror" target="_blank">Showcase room</Link>
        <Link to="/Check" target="_blank"> Water demo</Link>
        <Link to="/Physics" target="_blank"> First Physics </Link>
        <Link to="/LearningPhysic" target="_blank"> Learning Physics layout</Link>
        <Link to="/SqauareGame" target="_blank">Sqauare Game demo</Link>
        <Link to="/PathFollow" target="_blank"> PathFollow demo</Link>
        <Link to="/Pathglb" target="_blank"> Path glb plus Physic speed </Link>
        <Link to="/Followdot" target="_blank"> Follow dot</Link>
        <Link to="/Glbphysi" target="_blank"> Glb physics learning</Link>
        <Link to="/Rft" target="_blank">React fiber clone (learning)</Link>
        <Link to="/Circle" target="_blank"> Circle physics</Link>
        <Link to="/Circleroom" target="_blank">Circleroom + play</Link>
        <Link to="/Ironman" target="_blank"> Heavy Glb testing Ironman</Link>
        <Link to="/Testmicro" target="_blank"> Particles pattern first</Link>
        <Link to="/Testmicro2" target="_blank"> Particles waves customise</Link> 
        <Link to="/TestSqauremixcro" target="_blank"> Particles cube pattern </Link>
        <Link to="/Universe" target="_blank">Static galaxy</Link>
        <Link to="/Che" target="_blank">Raycasting</Link>
        <Link to="/Pattern" target="_blank">Galaxy starter</Link>
      </div>
      <div className="linkList">
       <Link to="/Astronut" target="_blank"> Cursor and modal</Link>
        <Link to="/Astromouse" target="_blank"> Astro animation plus cursor</Link>
        <Link to="/MindSpacerocket" target="_blank">4 modals</Link>
        <Link to="/PhsSound" target="_blank"> Physics plus sound</Link>
        <Link to="/PhsJump" target="_blank"> Physics Jump</Link>
        <Link to="/PhsAir" target="_blank"> Physics Air</Link>
        <Link to="/Gltfmodal" target="_blank">Draco and gltf</Link>
        <Link to="/Bg" target="_blank">3d-text animated</Link>
        <Link to="/Hologram" target="_blank">Hologram</Link>
        <Link to="/Moving" target="_blank"> Moving circuit</Link>
        <Link to="/Thanos" target="_blank">Thanos waves</Link>
        <Link to="/FollowGame" target="_blank">Game (temple run)</Link>
        <Link to="/Fpsgame" target="_blank"> Fps game clone (learning) </Link>
        <Link to="/Playground" target="_blank">FPS Playground</Link>
        <Link to="/Spline" target="_blank"> Spline Demo</Link>
        <Link to="/Imagehover" target="_blank"> Matrix shaders</Link>
        <Link to="/TestingShader" target="_blank"> Water shader</Link>
        <Link to="/Thememind" target="_blank">Scroll demo</Link>
        <Link to="/TestingBg" target="_blank"> Testing Bg</Link>
      </div>
      <div className="linkList">
        <Link to="/Awwward" target="_blank">Portfolio 3d</Link>
        <Link to="/Shaderdemo" target="_blank"> Shader bg</Link>
        <Link to="/Wave" target="_blank"> Waves shader+three</Link>
        <Link to="/Experiment" target="_blank">Shader Rangoli</Link>
        <Link to="/AniStar" target="_blank"> Shader Star falling</Link>
        <Link to="/Cursor" target="_blank">Dream cursor</Link>
        <Link to="/AnimatedSpiral" target="_blank"> Animated Spiral</Link>
        <Link to="/ModifiedMaterial" target="_blank"> Modified Material</Link>
        <Link to="/Scene" target="_blank"> Glitch scene</Link>
        <Link to="/Smoke" target="_blank"> Smoke cursor</Link>
      </div>
    </div>
  );
}

export default App;
