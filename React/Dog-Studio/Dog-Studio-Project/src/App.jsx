import React from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import Dog from "./components/Dog";


const App = () => {
  return (
    <>
      <main>
        <Canvas style={{
           width:"100%",
           height:"100vh",
           position: "fixed",
           top:0,
           left:0,
           zIndex:1,
           backgroundImage:"url(/background-l.png)",
           backgroundRepeat:"no-repeat",
           backgroundSize:"cover"
        }}>
          <Dog />
        </Canvas>
        <section id="section-1" > hi there</section>
        <section id="section-2" ></section>
        <section id="section-3" ></section>
        <section id="section-4" ></section>
      </main>
    </>
  );
};

export default App;
