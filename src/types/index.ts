export interface ProcessingResult {
  fileName: string;
  midiData: Uint8Array;
  title: string;
  composer: string;
  processingDate: string;
  confidence: number;
  detectedElements: DetectedElements;
  metadata: MidiMetadata;
}

export interface DetectedElements {
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

export interface MidiMetadata {
  title: string;
  composer: string;
  copyright: string;
  processingDate: string;
  software: string;
  tracks: TrackInfo[];
}

export interface TrackInfo {
  name: string;
  instrument: string;
  clef: string;
  noteCount: number;
}

export interface ProcessingError {
  type: 'blur' | 'notation' | 'format' | 'handwritten' | 'multiple_signatures' | 'unknown';
  message: string;
  suggestions: string[];
  confidence: number;
}

export interface ProcessingOptions {
  preferredTempo?: number;
  preferredKey?: string;
  selectedPages?: number[];
  processingMode: 'standard' | 'enhanced' | 'manual_assist';
  includeChords: boolean;
  includeLyrics: boolean;
  separateTracks: boolean;
}

export type ProcessingStatus = 'idle' | 'uploading' | 'analyzing' | 'processing' | 'generating' | 'success' | 'error' | 'partial_success';

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  speed: number;
  volume: number;
  loop: boolean;
  currentNote?: string;
}