import React from 'react';
import { arrow } from '../assets/icons';
import { Link } from 'react-router-dom';

function stopMusic(setIsPlayingMusic, setIsRotating){
    setIsPlayingMusic(false)
    setIsRotating(false)
}

const InfoBox = ({ text, link, btnText, setIsPlayingMusic, setIsRotating, setIsPlayingRotation }) => (
    <div className='info-box'>
      <p className='font-medium sm:text-xl text-center'>{text}</p>
      <Link 
        to={link} 
        className='neo-brutalism-white neo-btn' 
        target='_blank' 
        rel='noreferrer' 
        onClick={() => {
          stopMusic(setIsPlayingMusic, setIsRotating);
          setIsPlayingRotation(false);
        }}
      >
        {btnText}
        <img src={arrow} className='w-4 h-4 object-contain' />
      </Link>
    </div>
  );

const renderContent = (setIsPlayingMusic, setIsRotating, setIsPlayingRotation) => ({
  1: (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='sm:text-xl sm:leading-snug text-center neo-brutalism-blue py-4 px-8 text-white mx-5'>
        Hi I am <span className='font-semibold'>Aurélien</span> 👋
        <br />
        A Software Engineer from France
      </h1>
    </div>
  ),
  2: (
    <InfoBox 
      text="Worked with many companies and picked up many skills along the way"
      link="/about"
      btnText="Learn more"
      setIsPlayingMusic={setIsPlayingMusic}
      setIsRotating={setIsRotating}
      setIsPlayingRotation={setIsPlayingRotation} 
    />
  ),
  3: (
    <InfoBox 
      text="Led multiple projects to success over the years. Curious about the impact ?"
      link="/projects"
      btnText="Visit my portfolio"
      setIsPlayingMusic={setIsPlayingMusic}
      setIsRotating={setIsRotating}
      setIsPlayingRotation={setIsPlayingRotation} 
    />
  ),
  4: (
    <InfoBox 
      text="Need a project done or looking for a dev ? I'm just a few keystrokes away"
      link="/contact"
      btnText="Let's talk"
      setIsPlayingMusic={setIsPlayingMusic}
      setIsRotating={setIsRotating}
      setIsPlayingRotation={setIsPlayingRotation} 
    />
  ),
});

const HomeInfo = ({ currentStage, setIsPlayingMusic, setIsRotating, setIsPlayingRotation }) => {
  const content = renderContent(setIsPlayingMusic, setIsRotating, setIsPlayingRotation);
  return content[currentStage] || null;
}

export default HomeInfo;
