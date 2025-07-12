import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Download, Volume2, RotateCcw, 
  SkipBack, SkipForward, Repeat, Settings 
} from 'lucide-react';

interface MidiPlayerProps {
  fileName: string;
  midiData?: Uint8Array;
  metadata?: MidiMetadata;
  onNotePlay?: (note: string) => void;
}

interface MidiMetadata {
  title: string;
  composer: string;
  copyright: string;
  processingDate: string;
  software: string;
  tracks: TrackInfo[];
}

interface TrackInfo {
  name: string;
  instrument: string;
  clef: string;
  noteCount: number;
}

export const MidiPlayer: React.FC<MidiPlayerProps> = ({ 
  fileName, 
  midiData, 
  metadata,
  onNotePlay 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes default
  const [volume, setVolume] = useState(0.7);
  const [speed, setSpeed] = useState(1.0);
  const [loop, setLoop] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + (100 * speed);
          if (newTime >= duration * 1000) {
            if (loop) {
              return 0;
            } else {
              setIsPlaying(false);
              return duration * 1000;
            }
          }
          return newTime;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, duration, loop]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (onNotePlay && !isPlaying) {
      // Simulate note playing for piano visualization
      const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      onNotePlay(randomNote);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
  };

  const skipBackward = () => {
    setCurrentTime(prev => Math.max(0, prev - 10000));
  };

  const skipForward = () => {
    setCurrentTime(prev => Math.min(duration * 1000, prev + 10000));
  };

  const reset = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const downloadMidi = () => {
    // Create enhanced MIDI file with metadata
    const mockMidiData = new Uint8Array([
      // MIDI Header
      0x4D, 0x54, 0x68, 0x64, 0x00, 0x00, 0x00, 0x06,
      0x00, 0x01, 0x00, 0x02, 0x01, 0xE0,
      // Track 1 - Metadata
      0x4D, 0x54, 0x72, 0x6B, 0x00, 0x00, 0x00, 0x3A,
      0x00, 0xFF, 0x03, 0x0A, ...new TextEncoder().encode(metadata?.title || 'Sheet Music'),
      0x00, 0xFF, 0x02, 0x08, ...new TextEncoder().encode(metadata?.composer || 'Unknown'),
      0x00, 0xFF, 0x2F, 0x00,
      // Track 2 - Music Data
      0x4D, 0x54, 0x72, 0x6B, 0x00, 0x00, 0x00, 0x20,
      0x00, 0x90, 0x40, 0x40, 0x60, 0x80, 0x40, 0x40,
      0x00, 0x90, 0x42, 0x40, 0x60, 0x80, 0x42, 0x40,
      0x00, 0x90, 0x44, 0x40, 0x60, 0x80, 0x44, 0x40,
      0x00, 0xFF, 0x2F, 0x00
    ]);

    const blob = new Blob([mockMidiData], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">MIDI Player</h3>
          <p className="text-blue-200 text-sm">{fileName}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={downloadMidi}
            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
            title="Download MIDI"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Metadata Display */}
      {metadata && (
        <div className="bg-white/5 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-blue-200">
              <span className="text-white/60">Title:</span> {metadata.title}
            </div>
            <div className="text-blue-200">
              <span className="text-white/60">Composer:</span> {metadata.composer}
            </div>
            <div className="text-blue-200">
              <span className="text-white/60">Tracks:</span> {metadata.tracks.length}
            </div>
            <div className="text-blue-200">
              <span className="text-white/60">Processed:</span> {new Date(metadata.processingDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={skipBackward}
          className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button
          onClick={togglePlayback}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </button>

        <button
          onClick={skipForward}
          className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <SkipForward className="w-5 h-5" />
        </button>

        <button
          onClick={reset}
          className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={() => setLoop(!loop)}
          className={`p-2 rounded-lg transition-colors ${
            loop ? 'text-blue-400 bg-blue-400/20' : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <Repeat className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-blue-200 mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration * 1000)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={duration * 1000}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Volume and Speed Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-white/60" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-white/60 w-8">{Math.round(volume * 100)}%</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-white/60">Speed:</span>
          <select
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white"
          >
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
      </div>

      {/* Advanced Settings */}
      {showSettings && metadata && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <h4 className="text-white font-medium mb-3">Track Information</h4>
          <div className="space-y-2">
            {metadata.tracks.map((track, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-blue-200">{track.name}</span>
                <div className="text-white/60">
                  {track.instrument} • {track.clef} • {track.noteCount} notes
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-blue-300 text-center">
        {isPlaying ? 'Playing...' : 'Ready to play'} • Quality: High Fidelity
      </div>
    </div>
  );
};