import { useEffect } from 'react';
import './App.css';
import SpeechToText from './components/SpeechToText';

function App() {
  

  return (
    <div className='border-4 p-4 border-blue-500 w-screen h-screen flex justify-center items-center'>
      <SpeechToText />
    </div>
  );
}

export default App;
