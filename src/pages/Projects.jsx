import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from '../components/Experience';
import { UI } from '../components/UI';
import { Suspense } from "react";

const Projects = () => {
  return (
    <>
      <UI />
      <div style={{height: "100vh"}}>
      <Canvas shadows camera={{ position: [-0.5, 1, 4], fov: 45 }}>
        <group position-y={0}>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </group>
      </Canvas>
      </div>
    </>
  );
};

export default Projects;
