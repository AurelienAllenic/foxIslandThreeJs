import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Loader from '../components/Loader';
import Island from '../models/Island';
import Sky from '../models/Sky';
import Bird from '../models/Bird';
import Plane from '../models/Plane';
import HomeInfo from '../components/HomeInfo';
import sakura from "../assets/sakura.mp3";
import { soundoff, soundon } from '../assets/icons';
import { SlControlPlay } from "react-icons/sl";
import { CiPause1 } from "react-icons/ci";
import planeFlying from "../assets/flying-plane.mp3";
import { GrRotateRight } from "react-icons/gr";
import { GiClick } from "react-icons/gi";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

const Home = () => {
  const audioRef = useRef(new Audio(sakura));
  audioRef.current.volume = 0.1;
  audioRef.current.loop = true;

  const audioPlaneRef = useRef(new Audio(planeFlying));
  audioPlaneRef.current.volume = 0.7;
  audioPlaneRef.current.loop = true;

  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isPlayingRotation, setIsPlayingRotation] = useState(false);
  const [isPlayingPlaneMusic, setIsPlayingPlaneMusic] = useState(false);
  const [isVolumeOn, setIsVolumeOn] = useState(false);
  const [hasBeenRotateOnce, setHasBeenRotateOnce] = useState(false)

  const checkSound = () => {
    if (isPlayingMusic) {
      setIsVolumeOn(true);
    } else {
      setIsVolumeOn(false);
      audioPlaneRef.current.pause();
    }
  };
  useEffect(() => {
    checkSound();
    return () => {
      audioPlaneRef.current.pause();
      audioRef.current.pause();
    };
  }, [isPlayingMusic]);

  useEffect(() => {
    if (isVolumeOn) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioPlaneRef.current.pause(); // Arrêter le son de l'avion si le volume général est désactivé
    }

    return () => {
      audioRef.current.pause();
      audioPlaneRef.current.pause();
    };
  }, [isVolumeOn]);

  const adjustIslandForScreenSize = () => {
    let screenScale = null;
    let screenPosition = [0, -6.5, -43];
    let rotation = [0.1, 4.7, 0];

    if (window.innerWidth > 768) {
      screenScale = [0.9, 0.9, 0.9];
    } else {
      screenScale = [1, 1, 1];
    }
    return [screenScale, screenPosition, rotation];
  };

  const adjustPlaneForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth > 768) {
      screenScale = [1.5, 1.5, 1.5];
      screenPosition = [0, -1.5, 0];
    } else {
      screenScale = [3, 3, 3];
      screenPosition = [0, -4, -4];
    }
    return [screenScale, screenPosition];
  };

  const [islandScale, islandPosition, islandRotation] = adjustIslandForScreenSize();
  const [planeScale, planePosition] = adjustPlaneForScreenSize();

  return (
    <section className='w-full h-screen relative'>
      <div className='absolute top-28 left-0 right-0 z-10 flex items-center justify-center'>
        {currentStage && <HomeInfo currentStage={currentStage} setIsPlayingMusic={setIsPlayingMusic} setIsRotating={setIsRotating} />}
      </div>
      <Canvas
        className={`w-full h-screen bg-transparent ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`}
        camera={{ near: 0.1, far: 1000 }}
      >
        <Suspense fallback={<Loader />}>
          <directionalLight position={[1, 1, 1]} intensity={2} />
          <ambientLight intensity={0.5} />
          <hemisphereLight skyColor="#b1e1ff" groundColor={'#000'} intensity={1} />
          <Sky isRotating={isRotating} />
          <Bird />
          <Island
            position={islandPosition}
            scale={islandScale}
            rotation={islandRotation}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
            generalMusic={isVolumeOn}
            setIsGeneralMusic={setIsVolumeOn}
            isPlayingRotation={isPlayingRotation}
            setIsPlayingRotation={setIsPlayingRotation}
            audioRef={audioPlaneRef}
            isPlayingPlaneMusic={isPlayingPlaneMusic}
            setIsPlayingPlaneMusic={setIsPlayingPlaneMusic}
            setHasBeenRotateOnce={setHasBeenRotateOnce}
          />
          <Plane
            scale={planeScale}
            position={planePosition}
            isRotating={isRotating}
            rotation={[0, 20, 0]}
          />
        </Suspense>
      </Canvas>
      {
        !hasBeenRotateOnce &&
        <div className='absolute bottom-14 left-0 right-0 z-10 flex items-center justify-center '>
          {/*<p className='text-xl w-1/2 text-center text-slate-600'>Faites tourner le modèle en saisissant l'avion avec votre souris ou actionnez le bouton play pour une rotation auto</p>*/}
          <div className='container-rotate'>
            <GrRotateRight className='rotate-fade text-4xl text-[#0092db]' />
          </div>
          <GiClick className='click text-4xl text-[#0092db] absolute' />
        </div>
      }
      
      <div className='absolute bottom-5 left-5 flex items-center justify-center gap-5'>
        <img src={!isPlayingMusic ? soundon : soundoff} alt="sound" className='w-10 h-10 cursor-pointer object-contain' onClick={() => setIsPlayingMusic(!isPlayingMusic)} />
        {!hasBeenRotateOnce && <GoArrowLeft className='text-5xl arrow text-[#6056f2]'/>}
      </div>
      <div className='absolute bottom-5 right-5 flex items-center gap-5'>
      {!hasBeenRotateOnce && <GoArrowRight className='text-5xl arrow text-[#6056f2]'/>}
      <button
        className="w-10 h-10 bg-[#6056f2] rounded-full cursor-pointer flex items-center justify-center"
        onClick={() => {
          setIsPlayingRotation(!isPlayingRotation);
          checkSound();
          setHasBeenRotateOnce(true)
        }}
      >
        {!isPlayingRotation ? <SlControlPlay className="text-white" /> : <CiPause1 className="text-white" />}
      </button>
      </div>
    </section>
  );
};

export default Home;
