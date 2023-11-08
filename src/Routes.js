import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import FirstDemo from "./FirstDemo";
import Second from "./Second";
import Testone from "./Testone";
import Third from "./Third";
import Fourth from "./Fourth";
import SmileyEmoji from "./SmileyEmoji";
import Fifth from "./Fifth";
import Sixth from "./Sixth";
import Seventh from "./Seventh";
import SunEarth from "./Sunearth";
import Eight from "./Eight";
import IronManHelmet from "./Ironman";
import GLTFLoaderDemo from "./Gltfdemo";
import Tenth from "./Tenth";
import ThreeScene from "./ThreeScene";
import Eleventh from "./Eleventh";
import River from "./River";
import WaterS from "./WaterS";
import House from "./House";
import Soldier from "./Soldier";
import Skeleton from "./Skeleton";
import Cube from "./Cube";
import NavbarCube from "./NavbarCube";
import ChangeSide from "./ChangeSide";
import Mind from "./Mind";
import Refle from "./Refle";
import Mirror from "./Mirror";
import Trialodffloor from "./Trialodffloor";
import Raycc from "./RayCasting";
import Check from "./Check";
import Physics from "./Physics";
import Trial from "./Trial";
import LearningPhysic from "./LearningPhysic";
import SqauareGame from "./SqauareGame";
import PathFollow from "./PathFollow";
import Pathglb from "./Pathglb";
import Followdot from "./Followdot";
import Glbphysi from "./Glbphysi";
import Rft from "./Rft";
import Circle from "./Circle";
import Circleroom from "./CircleRoom";
import Collison from "./Collison";
import Ironman from "./Ironmans";
import Ortho from "./Ortho";
import TwoCubes from "./Twocube";
import Testmicro from "./Testmicro";
import Testmicro2 from "./Testmicro2";
import TestSqauremixcro from "./TestSqauremixcro";
import Universe from "./Universe";
import Che from "./Che";
import Pattern from "./Pattern";
import Port from "./Port";
import Astronut from "./Astronut";
import Astro from "./Astro";
import Astromouse from "./Astromouse";
import MindSpacerocket from "./MindSpacerocket";
import PhsSound from "./PhsSound";
import CannonStart from "./CannonStart";
import PhsJump from "./PhsJump";
import PhsAir from "./PhyAir";
import Phsbal from "./Phsbal";
import Gltfmodal from "./Gltfmodal";
import Bg from "./Bg";
import Hologram from "./Hologram";
import Moving from "./Moving";
import Thanos from "./Thanos";
import ThanosSmall from "./ThanosSmall";
import FollowGame from "./FollowGame";
import Presentation from "./Presentation";
import Fpsgame from "./Fpsgame";
import Playground from "./Playground";
import Spline from "./Spline";
import Imagehover from "./Imagehover";
import TestingShader from "./TestingShader";
import Branding from "./Branding";
import Branding2 from "./Branding2";
import Thememind from "./Thememind";
import TestingBg from "./TestingBg";
import Awwward from "./Awwward";
import Demo from "./Demo";
import Shaderdemo from "./Shaderdemo";
import Wave from "./Wave";
import ARDemo from "./ARDemo";
import Experiment from "./Experiment";
import AniStar from "./AniStar";
import Cursor from "./Cursor";
import AnimatedSpiral from "./AnimatedSpiral";
import ModifiedMaterial from "./ModifiedMaterial";
import Scene from "./Scene";
import CheckBox from "./CheckBox";
import Test from "./Test";
import Test2 from "./Test2";
import Layers from "./Layers";
import SwingingSVG from "./SwingingSVG";
import Smoke from "./Smoke";
import WaveDiv from "./WaveDiv";
import Animate from "./Animate";

const AllRoutes = () => {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" Component={App} />
          <Route path="/Animate" Component={Animate} />
          <Route path="/AnimatedSpiral" Component={AnimatedSpiral} />
          <Route path="/AniStar" Component={AniStar} />
          <Route path="/ARDemo" Component={ARDemo} />
          <Route path="/Astro" Component={Astro} />
          <Route path="/Astronut" Component={Astronut} />
          <Route path="/Awwward" Component={Awwward} />
          <Route path="/Bg" Component={Bg} />
          <Route path="/Branding" Component={Branding} />
          <Route path="/Branding2" Component={Branding2} />
          <Route path="/CannonStart" Component={CannonStart} />
          <Route path="/Che" Component={Che} />
          <Route path="/Check" Component={Check} />
          <Route path="/CheckBox" Component={CheckBox} />
          <Route path="/Circle" Component={Circle} />
          <Route path="/Circleroom" Component={Circleroom} />
          <Route path="/Collison" Component={Collison} />
          <Route path="/Cube" Component={Cube} />
          <Route path="/Cursor" Component={Cursor} />
          <Route path="/Demo" Component={Demo} />
          <Route path="/Eight" Component={Eight} />
          <Route path="/Eleventh" Component={Eleventh} />
          <Route path="/Experiment" Component={Experiment} />
          <Route path="/Fifth" Component={Fifth} />
          <Route path="/FirstDemo" Component={FirstDemo} />
          <Route path="/Followdot" Component={Followdot} />
          <Route path="/FollowGame" Component={FollowGame} />
          <Route path="/Fourth" Component={Fourth} />
          <Route path="/Fpsgame" Component={Fpsgame} />
          <Route path="/Glbphysi" Component={Glbphysi} />
          <Route path="/GLTFLoaderDemo" Component={GLTFLoaderDemo} />
          <Route path="/Gltfmodal" Component={Gltfmodal} />
          <Route path="/Hologram" Component={Hologram} />
          <Route path="/House" Component={House} />
          <Route path="/Imagehover" Component={Imagehover} />
          <Route path="/Ironman" Component={Ironman} />
          <Route path="/IronManHelmet" Component={IronManHelmet} />
          <Route path="/Layers" Component={Layers} />
          <Route path="/LearningPhysic" Component={LearningPhysic} />
          <Route path="/Mind" Component={Mind} />
          <Route path="/MindSpacerocket" Component={MindSpacerocket} />
          <Route path="/Mirror" Component={Mirror} />
          <Route path="/ModifiedMaterial" Component={ModifiedMaterial} />
          <Route path="/Moving" Component={Moving} />
          <Route path="/NavbarCube" Component={NavbarCube} />
          <Route path="/Ortho" Component={Ortho} />
          <Route path="/PathFollow" Component={PathFollow} />
          <Route path="/Pathglb" Component={Pathglb} />
          <Route path="/Pattern" Component={Pattern} />
          <Route path="/Phsbal" Component={Phsbal} />
          <Route path="/PhsJump" Component={PhsJump} />
          <Route path="/PhsSound" Component={PhsSound} />
          <Route path="/PhsAir" Component={PhsAir} />
          <Route path="/Physics" Component={Physics} />
          <Route path="/Playground" Component={Playground} />
          <Route path="/Port" Component={Port} />
          <Route path="/Presentation" Component={Presentation} />
          {/* <Route path="/RandomParticles" Component={RandomParticles} /> */}
          <Route path="/Raycc" Component={Raycc} />
          <Route path="/Refle" Component={Refle} />
          <Route path="/Rft" Component={Rft} />
          <Route path="/River" Component={River} />
          <Route path="/Scene" Component={Scene} />
          <Route path="/Second" Component={Second} />
          <Route path="/Seventh" Component={Seventh} />
          <Route path="/Shaderdemo" Component={Shaderdemo} />
          <Route path="/Sixth" Component={Sixth} />
          <Route path="/Skeleton" Component={Skeleton} />
          <Route path="/SmileyEmoji" Component={SmileyEmoji} />
          <Route path="/Smoke" Component={Smoke} />
          <Route path="/Soldier" Component={Soldier} />
          <Route path="/Spline" Component={Spline} />
          <Route path="/SqauareGame" Component={SqauareGame} />
          <Route path="/SunEarth" Component={SunEarth} />
          <Route path="/SwingingSVG" Component={SwingingSVG} />
          <Route path="/Tenth" Component={Tenth} />
          <Route path="/Test" Component={Test} />
          <Route path="/Test2" Component={Test2} />
          <Route path="/TestingBg" Component={TestingBg} />
          <Route path="/TestingShader" Component={TestingShader} />
          <Route path="/Testmicro" Component={Testmicro} />
          <Route path="/Testmicro2" Component={Testmicro2} />
          <Route path="/Testone" Component={Testone} />
          <Route path="/TestSqauremixcro" Component={TestSqauremixcro} />
          <Route path="/Thanos" Component={Thanos} />
          <Route path="/ThanosSmall" Component={ThanosSmall} />
          <Route path="/Thememind" Component={Thememind} />
          <Route path="/Third" Component={Third} />
          <Route path="/ThreeScene" Component={ThreeScene} />
          <Route path="/Trial" Component={Trial} />
          <Route path="/Trialodffloor" Component={Trialodffloor} />
          <Route path="/TwoCubes" Component={TwoCubes} />
          <Route path="/Universe" Component={Universe} />
          <Route path="/WaterS" Component={WaterS} />
          <Route path="/Wave" Component={Wave} />
          <Route path="/WaveDiv" Component={WaveDiv} />

          <Route path="/ChangeSide" Component={ChangeSide} />
          {/* <Route path="/Bloom" Component={Bloom} /> */}
          <Route path="/Astromouse" Component={Astromouse} />
        </Routes>
      </HashRouter>
    </>
  );
};

export default AllRoutes;
