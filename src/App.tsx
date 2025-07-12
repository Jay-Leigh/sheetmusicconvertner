import React, { useState } from 'react';
import { Music, Github, Info, Zap, Target, Shield } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { ProcessingStatus } from './components/ProcessingStatus';
import { MidiPlayer } from './components/MidiPlayer';
import { VirtualPiano } from './components/VirtualPiano';
import { HelpSystem } from './components/HelpSystem';
import { useSheetMusicProcessor } from './hooks/useSheetMusicProcessor';

function App() {
  const { 
    status, 
    progress, 
    currentStep, 
    result, 
    error, 
    estimatedTime,
    detectedElements,
    processFile, 
    reset 
  } = useSheetMusicProcessor();
  
  const [currentNote, setCurrentNote] = useState<string>();

  const handleNotePlay = (note: string) => {
    setCurrentNote(note);
    setTimeout(() => setCurrentNote(undefined), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Sheet2MIDI Pro</h1>
                <p className="text-sm text-blue-200">Advanced AI Music Recognition</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 text-sm text-blue-200">
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>Fast Processing</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>High Accuracy</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Secure</span>
                </div>
              </div>
              <a 
                href="#" 
                className="text-blue-200 hover:text-white transition-colors"
                title="View on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Convert Sheet Music to MIDI
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-6">
            Upload your sheet music images or PDFs and get professional-quality MIDI files with 
            accurate tempo, clef recognition, dynamics, and note precision using advanced AI.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-300">
            <span className="bg-white/10 px-3 py-1 rounded-full">✓ Multi-page PDF support</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">✓ Batch processing</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">✓ Professional accuracy</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">✓ Real-time playback</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Upload Sheet Music</h3>
              <FileUpload 
                onFileSelect={processFile} 
                isProcessing={status === 'uploading' || status === 'analyzing' || status === 'processing' || status === 'generating'} 
              />
            </div>

            {/* Processing Status */}
            <ProcessingStatus
              status={status}
              progress={progress}
              currentStep={currentStep}
              error={error}
              estimatedTime={estimatedTime}
              detectedElements={detectedElements}
            />

            {/* Result Section */}
            {result && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Conversion Result</h3>
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-white">{result.title}</h4>
                      <p className="text-blue-200">by {result.composer}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${
                        result.confidence > 0.8 
                          ? 'bg-green-100 text-green-800' 
                          : result.confidence > 0.6 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {Math.round(result.confidence * 100)}% Confidence
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-blue-300">
                    File: {result.fileName} • Processed: {new Date(result.processingDate).toLocaleDateString()}
                  </p>
                </div>
                
                <MidiPlayer 
                  fileName={result.fileName}
                  midiData={result.midiData}
                  metadata={result.metadata}
                  onNotePlay={handleNotePlay}
                />
              </div>
            )}

            {/* Reset Button */}
            {(status === 'success' || status === 'partial_success' || status === 'error') && (
              <button
                onClick={reset}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Convert Another File
              </button>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Virtual Piano */}
            <VirtualPiano 
              currentNote={currentNote}
              onNotePlay={handleNotePlay}
            />

            {/* Features */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Advanced Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-blue-100 text-sm">Multi-clef Recognition</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-blue-100 text-sm">Tempo Detection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-blue-100 text-sm">Dynamics Processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-blue-100 text-sm">Chord Recognition</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-blue-100 text-sm">Multi-track Export</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-blue-100 text-sm">Batch Processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-blue-100 text-sm">Quality Scoring</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-blue-100 text-sm">Error Recovery</span>
                </div>
              </div>
            </div>

            {/* Processing Modes */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Processing Modes</h3>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-3">
                  <h4 className="font-medium text-white text-sm">Standard Mode</h4>
                  <p className="text-blue-200 text-xs">Fast processing for clear notation</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <h4 className="font-medium text-white text-sm">Enhanced Mode</h4>
                  <p className="text-blue-200 text-xs">Higher accuracy for complex scores</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <h4 className="font-medium text-white text-sm">Manual Assist</h4>
                  <p className="text-blue-200 text-xs">Interactive correction options</p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-100 mb-2">AI Integration Ready</h4>
                  <p className="text-amber-200 text-sm">
                    This system is designed to integrate with Google Vision API and other AI services 
                    for production-level optical music recognition. The current implementation 
                    demonstrates the complete workflow and user experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-sm border-t border-white/10 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-blue-200">
            <p>&copy; 2025 Sheet2MIDI Pro. Advanced AI-Powered Music Recognition Technology.</p>
            <p className="text-sm text-blue-300 mt-1">
              Supporting musicians worldwide with cutting-edge optical music recognition.
            </p>
          </div>
        </div>
      </footer>

      {/* Help System */}
      <HelpSystem />
    </div>
  );
}

export default App;