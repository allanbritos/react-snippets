'use client';
import React, { useEffect, useState } from 'react';
import annyang from 'annyang';
import TextToSpeech from './TextToSpeech';

const SpeechToText = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [paused, setPaused] = useState(false);
  const [started, setStarted] = useState(false);

  const [playback, setPlayback] = useState(false);

  useEffect(() => {
    if (started && annyang) {
      console.log('starting');
      annyang.start();

      // Define a command to capture spoken text
      annyang.addCallback('result', (phrases) => {
        if (phrases && phrases[0]) {
          setRecognizedText(phrases[0]);
        }
      });
    }

    return () => {
      if (started && annyang) {
        annyang.removeCallback('result');
        annyang.abort();
      }
    };
  }, [started]);

  useEffect(() => {
    annyang && paused ? annyang.pause() : annyang.resume();
  }, [paused, started]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (annyang) {
        annyang.removeCallback('result');
        annyang.abort();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const pause = () => {
    setPaused(true);
  };

  const resume = () => {
    setPaused(false);
  };

  const start = () => {
    setStarted(true);
  };

  const stop = () => {
    setStarted(false);
  };

  const handlePlayback = (e) => {
    setPlayback(!playback);
  };

  return (
    <div className='w-[300px] h-[300px] p-4 border-2 flex flex-col justify-start items-center rounded-lg shadow-lg'>
      <div className='flex flex-col gap-4 items-center'>
        <h1 className='text-xl font-semibold'>SpeechRecognition App</h1>
        <div>
          {!started && (
            <div className='flex gap-2'>
              <button className='btn' onClick={start}>
                Start Voice
              </button>
            </div>
          )}
          {started && (
            <button className='btn btn-close' onClick={stop}>
              Stop Voice
            </button>
          )}
          <div className='flex gap-2 items-center justify-center'>
            <label>playback</label>
            <input type='checkbox' onChange={handlePlayback} />
          </div>
        </div>
        <div className='flex gap-4'>
          {started && !paused && (
            <button className='btn btn-stop' onClick={pause}>
              Mute Mic
            </button>
          )}
          {started && paused && (
            <button className='btn btn-start' onClick={resume}>
              Open Mic
            </button>
          )}
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <p>{recognizedText}</p>
      </div>
      {playback && <TextToSpeech text={recognizedText} />}
    </div>
  );
};

export default SpeechToText;
