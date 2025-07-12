import React, { useState, useEffect } from 'react';

const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blackKeys = ['C#', 'D#', null, 'F#', 'G#', 'A#', null];

interface VirtualPianoProps {
  currentNote?: string;
  onNotePlay?: (note: string) => void;
}

export const VirtualPiano: React.FC<VirtualPianoProps> = ({ currentNote, onNotePlay }) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [octave, setOctave] = useState(4);

  useEffect(() => {
    if (currentNote) {
      setPressedKeys(prev => new Set(prev).add(currentNote));
      setTimeout(() => {
        setPressedKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(currentNote);
          return newSet;
        });
      }, 300);
    }
  }, [currentNote]);

  const playNote = (note: string) => {
    const fullNote = `${note}${octave}`;
    setPressedKeys(prev => new Set(prev).add(fullNote));
    onNotePlay?.(fullNote);
    
    // Visual feedback
    setTimeout(() => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(fullNote);
        return newSet;
      });
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const keyMap: { [key: string]: string } = {
      'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#', 'd': 'E',
      'f': 'F', 't': 'F#', 'g': 'G', 'y': 'G#', 'h': 'A',
      'u': 'A#', 'j': 'B'
    };

    const note = keyMap[e.key.toLowerCase()];
    if (note && !e.repeat) {
      playNote(note);
    }
  };

  return (
    <div 
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Virtual Piano</h3>
        <div className="flex items-center space-x-2">
          <span className="text-white/60 text-sm">Octave:</span>
          <select
            value={octave}
            onChange={(e) => setOctave(parseInt(e.target.value))}
            className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
          >
            {[2, 3, 4, 5, 6].map(oct => (
              <option key={oct} value={oct}>{oct}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="relative bg-gray-900 p-4 rounded-lg shadow-inner">
        <div className="flex relative">
          {/* White keys */}
          {whiteKeys.map((note, index) => {
            const fullNote = `${note}${octave}`;
            const isPressed = pressedKeys.has(fullNote) || pressedKeys.has(note);
            
            return (
              <button
                key={`white-${note}`}
                className={`w-12 h-32 border border-gray-300 transition-all duration-75 ${
                  isPressed 
                    ? 'bg-blue-200 shadow-inner' 
                    : 'bg-white hover:bg-gray-100 shadow-lg'
                } ${index === 0 ? 'rounded-l-lg' : ''} ${
                  index === whiteKeys.length - 1 ? 'rounded-r-lg' : ''
                }`}
                onMouseDown={() => playNote(note)}
                onMouseUp={() => {
                  setPressedKeys(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(fullNote);
                    return newSet;
                  });
                }}
              >
                <span className="text-xs text-gray-600 mt-auto block font-medium">
                  {note}
                </span>
              </button>
            );
          })}

          {/* Black keys */}
          <div className="absolute flex">
            {blackKeys.map((note, index) => {
              if (!note) {
                return <div key={`empty-${index}`} className="w-8" style={{ marginLeft: '16px' }} />;
              }

              const fullNote = `${note}${octave}`;
              const isPressed = pressedKeys.has(fullNote) || pressedKeys.has(note);

              return (
                <button
                  key={`black-${note}`}
                  className={`w-8 h-20 transition-all duration-75 rounded-b-lg shadow-lg ${
                    isPressed 
                      ? 'bg-blue-600 shadow-inner' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  } text-white text-xs font-medium`}
                  style={{ marginLeft: index === 0 ? '32px' : '16px' }}
                  onMouseDown={() => playNote(note)}
                  onMouseUp={() => {
                    setPressedKeys(prev => {
                      const newSet = new Set(prev);
                      newSet.delete(fullNote);
                      return newSet;
                    });
                  }}
                >
                  <span className="mt-auto block">{note}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="text-sm text-blue-200 text-center">
          Click keys or use keyboard: A-J for white keys, W,E,T,Y,U for black keys
        </div>
        <div className="text-xs text-white/60 text-center">
          Current octave: {octave} • Press keys for audio simulation
        </div>
      </div>
    </div>
  );
};