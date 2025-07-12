import React, { useState } from 'react';
import { HelpCircle, X, FileText, Camera, Settings, Music } from 'lucide-react';

export const HelpSystem: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Music className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Welcome to Sheet2MIDI</h3>
          <p className="text-blue-200">
            Convert your sheet music into high-quality MIDI files using advanced AI recognition.
          </p>
          <div className="space-y-2">
            <h4 className="font-medium text-white">Quick Start:</h4>
            <ol className="list-decimal list-inside space-y-1 text-blue-200 text-sm">
              <li>Upload your sheet music (PNG, JPG, or PDF)</li>
              <li>Choose processing options</li>
              <li>Wait for AI analysis to complete</li>
              <li>Download your MIDI file and play it back</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 'file-formats',
      title: 'Supported Formats',
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">File Format Support</h3>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-white">Images</h4>
              <p className="text-blue-200 text-sm">PNG, JPG, JPEG, TIFF, BMP</p>
              <p className="text-blue-300 text-xs">Recommended: 300 DPI or higher</p>
            </div>
            <div>
              <h4 className="font-medium text-white">Documents</h4>
              <p className="text-blue-200 text-sm">PDF (single or multi-page)</p>
              <p className="text-blue-300 text-xs">Maximum file size: 10MB</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      icon: <Camera className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Tips for Best Results</h3>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-white">Image Quality</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-200 text-sm">
                <li>Use high resolution (300+ DPI)</li>
                <li>Ensure good contrast between notes and background</li>
                <li>Avoid shadows and glare</li>
                <li>Keep the page flat and straight</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white">Notation Style</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-200 text-sm">
                <li>Standard printed notation works best</li>
                <li>Clear, unambiguous note heads</li>
                <li>Minimal handwritten annotations</li>
                <li>Standard clefs (treble, bass, alto)</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'processing-modes',
      title: 'Processing Modes',
      icon: <Settings className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Choose Your Processing Mode</h3>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-white">Standard Mode</h4>
              <p className="text-blue-200 text-sm">
                Fast processing for clear, standard notation. Best for most sheet music.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white">Enhanced Mode</h4>
              <p className="text-blue-200 text-sm">
                More thorough analysis for complex or challenging notation. Takes longer but more accurate.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white">Manual Assist Mode</h4>
              <p className="text-blue-200 text-sm">
                Interactive processing with manual correction options. Best for difficult or handwritten scores.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        title="Help & Support"
      >
        <HelpCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl border border-white/20 max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white/5 border-r border-white/20 p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Help & Support</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-600/20 text-blue-300'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {section.icon}
                  <span className="text-sm">{section.title}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {sections.find(s => s.id === activeSection)?.content}
          </div>
        </div>
      </div>
    </div>
  );
};