import React from 'react';
import { Loader2, Music, CheckCircle, XCircle, AlertTriangle, Eye, Settings } from 'lucide-react';

interface ProcessingStatusProps {
  status: 'idle' | 'uploading' | 'analyzing' | 'processing' | 'generating' | 'success' | 'error' | 'partial_success';
  progress: number;
  currentStep: string;
  error?: ProcessingError;
  estimatedTime?: number;
  detectedElements?: Partial<DetectedElements>;
}

interface ProcessingError {
  type: 'blur' | 'notation' | 'format' | 'handwritten' | 'multiple_signatures' | 'unknown';
  message: string;
  suggestions: string[];
  confidence: number;
}

interface DetectedElements {
  timeSignature: string;
  keySignature: string;
  tempo: number;
  tempoMarking: string;
  clefs: string[];
  noteCount: number;
  measures: number;
  dynamics: string[];
  articulations: string[];
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  status,
  progress,
  currentStep,
  error,
  estimatedTime,
  detectedElements
}) => {
  if (status === 'idle') return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
      case 'analyzing':
      case 'processing':
      case 'generating':
        return <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'partial_success':
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Music className="w-6 h-6 text-blue-400" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'uploading': return 'Uploading File';
      case 'analyzing': return 'Analyzing Sheet Music';
      case 'processing': return 'Processing Musical Notation';
      case 'generating': return 'Generating MIDI File';
      case 'success': return 'Processing Complete';
      case 'partial_success': return 'Partial Processing Complete';
      case 'error': return 'Processing Failed';
      default: return 'Processing';
    }
  };

  const getErrorTypeMessage = (type: string) => {
    switch (type) {
      case 'blur':
        return 'Image quality is too low for accurate recognition';
      case 'notation':
        return 'Unsupported or complex notation style detected';
      case 'handwritten':
        return 'Handwritten notation detected - accuracy may vary';
      case 'multiple_signatures':
        return 'Multiple time signatures found';
      case 'format':
        return 'File format or structure not supported';
      default:
        return 'Unknown processing error occurred';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex items-center space-x-3 mb-4">
        {getStatusIcon()}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">
            {getStatusTitle()}
          </h3>
          {estimatedTime && status !== 'success' && status !== 'error' && (
            <p className="text-blue-200 text-sm">
              Estimated time remaining: {Math.ceil(estimatedTime / 1000)}s
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {(status === 'uploading' || status === 'analyzing' || status === 'processing' || status === 'generating') && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-blue-200 mb-2">
            <span>{currentStep}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Current Processing Step */}
      {(status === 'analyzing' || status === 'processing') && (
        <div className="flex items-center space-x-2 text-sm text-blue-200 mb-4">
          <Eye className="w-4 h-4 animate-pulse" />
          <span>Analyzing musical elements...</span>
        </div>
      )}

      {/* Detected Elements Preview */}
      {detectedElements && (status === 'processing' || status === 'success' || status === 'partial_success') && (
        <div className="bg-white/5 rounded-lg p-4 mb-4">
          <h4 className="text-white font-medium mb-3 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Detected Elements
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {detectedElements.timeSignature && (
              <div className="text-blue-200">
                <span className="text-white/60">Time Signature:</span> {detectedElements.timeSignature}
              </div>
            )}
            {detectedElements.keySignature && (
              <div className="text-blue-200">
                <span className="text-white/60">Key:</span> {detectedElements.keySignature}
              </div>
            )}
            {detectedElements.tempo && (
              <div className="text-blue-200">
                <span className="text-white/60">Tempo:</span> {detectedElements.tempo} BPM
              </div>
            )}
            {detectedElements.clefs && detectedElements.clefs.length > 0 && (
              <div className="text-blue-200">
                <span className="text-white/60">Clefs:</span> {detectedElements.clefs.join(', ')}
              </div>
            )}
            {detectedElements.noteCount && (
              <div className="text-blue-200">
                <span className="text-white/60">Notes:</span> {detectedElements.noteCount}
              </div>
            )}
            {detectedElements.measures && (
              <div className="text-blue-200">
                <span className="text-white/60">Measures:</span> {detectedElements.measures}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Message */}
      {status === 'success' && (
        <div className="text-green-400">
          <p className="font-medium">Successfully converted sheet music to MIDI format!</p>
          <p className="text-sm text-green-300 mt-1">
            All musical elements have been accurately processed and converted.
          </p>
        </div>
      )}

      {/* Partial Success Message */}
      {status === 'partial_success' && (
        <div className="text-yellow-400">
          <p className="font-medium">Partial conversion completed</p>
          <p className="text-sm text-yellow-300 mt-1">
            Some sections were processed successfully, but others may need manual review.
          </p>
        </div>
      )}

      {/* Error Handling */}
      {status === 'error' && error && (
        <div className="space-y-3">
          <div className="text-red-400">
            <p className="font-medium">{getErrorTypeMessage(error.type)}</p>
            <p className="text-sm text-red-300 mt-1">{error.message}</p>
            {error.confidence < 0.5 && (
              <p className="text-xs text-red-200 mt-1">
                Confidence: {Math.round(error.confidence * 100)}%
              </p>
            )}
          </div>

          {error.suggestions.length > 0 && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <h5 className="text-red-300 font-medium mb-2">Suggestions:</h5>
              <ul className="text-sm text-red-200 space-y-1">
                {error.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};