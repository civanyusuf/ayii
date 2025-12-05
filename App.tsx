import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { BearModel } from './components/BearModel';
import { BearMood } from './types';
import { 
    CloudIcon, 
    FaceSmileIcon, 
    MoonIcon 
} from '@heroicons/react/24/solid';

const App: React.FC = () => {
  const [mood, setMood] = useState<BearMood>(BearMood.IDLE);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-blue-100 to-indigo-50">
      
      {/* 3D Scene Canvas */}
      <Canvas shadows camera={{ position: [0, 0, 6], fov: 50 }}>
        <fog attach="fog" args={['#f0f4f8', 8, 20]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.7} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Bear Component */}
        <Suspense fallback={null}>
            <BearModel mood={mood} />
        </Suspense>

        {/* Ground Shadows */}
        <ContactShadows 
            resolution={1024} 
            scale={10} 
            blur={2} 
            opacity={0.25} 
            far={10} 
            color="#000000" 
        />
        
        {/* Environment Reflections */}
        <Environment preset="city" />

        {/* Controls (Disabled zoom for better UX in this specific avatar case, or kept minimal) */}
        <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minPolarAngle={Math.PI / 2.5} 
            maxPolarAngle={Math.PI / 1.8} 
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex gap-4">
        
        <button
          onClick={() => setMood(BearMood.IDLE)}
          className={`
            flex flex-col items-center justify-center w-20 h-20 rounded-xl transition-all duration-300
            ${mood === BearMood.IDLE 
                ? 'bg-blue-500 text-white shadow-lg scale-110' 
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }
          `}
        >
          <CloudIcon className="w-8 h-8 mb-1" />
          <span className="text-xs font-semibold">Idle</span>
        </button>

        <button
          onClick={() => setMood(BearMood.HAPPY)}
          className={`
            flex flex-col items-center justify-center w-20 h-20 rounded-xl transition-all duration-300
            ${mood === BearMood.HAPPY 
                ? 'bg-yellow-400 text-white shadow-lg scale-110' 
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }
          `}
        >
          <FaceSmileIcon className="w-8 h-8 mb-1" />
          <span className="text-xs font-semibold">Happy</span>
        </button>

        <button
          onClick={() => setMood(BearMood.SLEEPY)}
          className={`
            flex flex-col items-center justify-center w-20 h-20 rounded-xl transition-all duration-300
            ${mood === BearMood.SLEEPY 
                ? 'bg-indigo-500 text-white shadow-lg scale-110' 
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }
          `}
        >
          <MoonIcon className="w-8 h-8 mb-1" />
          <span className="text-xs font-semibold">Sleepy</span>
        </button>

      </div>

      <div className="absolute top-6 left-6 pointer-events-none">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">BearAvatar<span className="text-blue-500">3D</span></h1>
        <p className="text-slate-500 text-sm">Interactive Procedural Model</p>
      </div>

       <div className="absolute top-6 right-6 pointer-events-none max-w-xs text-right">
        <p className="text-slate-400 text-xs">
          Try dragging to rotate.<br/>
          Head follows mouse in Idle/Happy modes.
        </p>
      </div>

    </div>
  );
};

export default App;
