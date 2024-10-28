/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: nimzu (https://sketchfab.com/nimzuk)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/foxs-islands-163b68e09fcc47618450150be7785907
Title: Fox's islands
*/

import React, { useRef, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import IslandScene from '../assets/3d/island.glb'
import { a } from "@react-spring/three"

const Island = ({isRotating, setIsRotating, setCurrentStage, generalMusic, setIsGeneralMusic, isPlayingRotation, setIsPlayingRotation, audioRef, isPlayingPlaneMusic, setIsPlayingPlaneMusic, setHasBeenRotateOnce, ...props}) => {
  
  const {gl, viewport} = useThree()
  const { nodes, materials } = useGLTF(IslandScene)
  const islandRef = useRef();
  const normalRotationSpeed = 0.006;
  const slowRotationSpeed = 0.003;
  const slowerRotationSpeed = 0.002;

  const lastX = useRef(0)
  const rotationSpeed = useRef(0)
  const dampingFactor = 0.95

  const handlePointerDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);
    setHasBeenRotateOnce(true)
    if (generalMusic) {
      setIsPlayingPlaneMusic(true);
    }
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    lastX.current = clientX;
  };
  
  const handlePointerUp = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(false);
    
    // Vérifiez si la musique générale est activée avant d'arrêter la musique de l'avion
    if (generalMusic && isPlayingPlaneMusic) {
      audioRef.current.pause(); // Arrêtez la musique de l'avion ici
      setIsPlayingPlaneMusic(false); // Mettez à jour l'état
    }
  };
  
  const handlePointerMove = (e) => {
    if (isPlayingRotation) return;
    e.stopPropagation()
    e.preventDefault()

    if(isRotating){
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const delta = (clientX - lastX.current) / viewport.width;
      islandRef.current.rotation.y += delta * 0.01 * Math.PI
      lastX.current = clientX
      rotationSpeed.current = delta * 0.01 * Math.PI
    }
  }

  const handleKeyDown = (e) => {
    if (isPlayingRotation) return;
    if(e.key === 'ArrowLeft'){
      if(!isRotating) setIsRotating(true);
        islandRef.current.rotation.y += 0.01 * Math.PI
        rotationSpeed.current = 0.0125;
    }else if(e.key === 'ArrowRight'){
      if(!isRotating) setIsRotating(true);
      islandRef.current.rotation.y -= 0.01 * Math.PI
      rotationSpeed.current = -0.0125;
    }
  }

  const handleKeyUp = (e) => {
    if(e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
      setIsRotating(false)
    }
  }

  const checkCurrentStage = () => {
    const rotation = islandRef.current.rotation.y
    const normalizedRotation = ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)

    switch (true) {
      case normalizedRotation >= 5.45 && normalizedRotation <= 5.85:
        setCurrentStage(4)
        break
      case normalizedRotation >= 0.85 && normalizedRotation <= 1.3:
        setCurrentStage(3)
        break
      case normalizedRotation >= 2.4 && normalizedRotation <= 2.6:
        setCurrentStage(2)
        break
      case normalizedRotation >= 4.25 && normalizedRotation <= 4.75:
        setCurrentStage(1)
        break
      default:
        setCurrentStage(null)
    }
  }

  useFrame(() => {
    checkCurrentStage();
    
    if (isPlayingRotation) {
      // Rotation automatique avec vérification des stages
      const rotation = islandRef.current.rotation.y;
      const normalizedRotation = ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  
      // Déterminer si l'avion est devant un stage
      let currentSpeed = normalRotationSpeed; // Vitesse par défaut
      if (
        (normalizedRotation >= 5.45 && normalizedRotation <= 5.85) || // Stage 4
        (normalizedRotation >= 0.85 && normalizedRotation <= 1.3) ||  // Stage 3
        
        (normalizedRotation >= 4.25 && normalizedRotation <= 4.75)    // Stage 1
      ) {
        currentSpeed = slowRotationSpeed; // Réduire la vitesse
      }else if(normalizedRotation >= 2.4 && normalizedRotation <= 2.6){
        currentSpeed = slowerRotationSpeed;
      }
  
      islandRef.current.rotation.y -= currentSpeed; // Appliquer la vitesse
      setIsRotating(true);
      
      if (generalMusic) {
        setIsPlayingPlaneMusic(true);
      }else{
        setIsPlayingPlaneMusic(false);
      }
    } else {
      // Logique de rotation manuelle existante
      if (!isRotating) {
        rotationSpeed.current *= dampingFactor;
  
        if (Math.abs(rotationSpeed.current) < 0.001) {
          rotationSpeed.current = 0;
        } else {
          const rotation = islandRef.current.rotation.y;
          const normalizedRotation =
            ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  
          checkCurrentStage(normalizedRotation);
        }
      }
    }
  });
  


  useEffect(() => {
    if (generalMusic) {
      if (isPlayingPlaneMusic) {
        audioRef.current.play();
      }
    } else {
      audioRef.current.pause(); // Assurez-vous que le son est arrêté
      setIsPlayingPlaneMusic(false); // Mettez à jour l'état pour indiquer que la musique ne joue pas
    }
  }, [generalMusic, isPlayingPlaneMusic]);
  
  useEffect(() => {
    if (!isPlayingRotation) {
      setIsPlayingRotation(false);
      setIsRotating(false);
      audioRef.current.pause(); // Arrête le son si la rotation automatique est désactivée
    } else {
      setIsPlayingRotation(true);
      setIsRotating(true);
      if(generalMusic){
        audioRef.current.play(); // Joue le son si la rotation automatique est activée
      }
      
    }
  }, [isPlayingRotation]);
  useEffect(() => {
    const canvas = gl.domElement
    if(!isPlayingRotation){
      canvas.addEventListener('pointerdown', handlePointerDown)
      canvas.addEventListener('pointerup', handlePointerUp)
      canvas.addEventListener('pointermove', handlePointerMove)
      canvas.addEventListener('keydown', handleKeyDown)
      canvas.addEventListener('keyup', handleKeyUp)
    }else{
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('keydown', handleKeyDown)
      canvas.removeEventListener('keyup', handleKeyUp)
    }
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('keydown', handleKeyDown)
      canvas.removeEventListener('keyup', handleKeyUp)
    }

  }, [gl, handlePointerDown, handlePointerUp, handlePointerMove])

  return (
    <a.group ref={islandRef} {...props}>
      <mesh
        geometry={nodes.polySurface944_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface945_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface946_tree2_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface947_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface948_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface949_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.pCube11_rocks1_0.geometry}
        material={materials.PaletteMaterial001}
      />
    </a.group>
  )
}

useGLTF.preload('/island.glb')

export default Island