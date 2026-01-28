import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { decode, encode, decodeAudioData } from '../services/audioUtils';
import { TranscriptionItem } from '../types';

const LiveView: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [history, setHistory] = useState<TranscriptionItem[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContextRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);
  const transcriptionRef = useRef({ input: '', output: '' });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.input.close();
      audioContextRef.current.output.close();
      audioContextRef.current = null;
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setIsActive(false);
    setIsConnecting(false);
  }, []);

  const startSession = async () => {
    if (isActive) return;
    setIsConnecting(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const outputNode = outputCtx.createGain();
      outputNode.connect(outputCtx.destination);
      
      audioContextRef.current = { input: inputCtx, output: outputCtx };

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };

              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
            setIsActive(true);
            setIsConnecting(false);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Audio processing
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              const outCtx = audioContextRef.current?.output;
              if (outCtx) {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
                const audioBuffer = await decodeAudioData(decode(base64Audio), outCtx, 24000, 1);
                const source = outCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outCtx.destination);
                source.onended = () => sourcesRef.current.delete(source);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }
            }

            // Interruption handling
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            // Transcription handling
            if (message.serverContent?.outputTranscription) {
              transcriptionRef.current.output += message.serverContent.outputTranscription.text;
            } else if (message.serverContent?.inputTranscription) {
              transcriptionRef.current.input += message.serverContent.inputTranscription.text;
            }

            if (message.serverContent?.turnComplete) {
              const inputMsg = transcriptionRef.current.input;
              const outputMsg = transcriptionRef.current.output;
              if (inputMsg) setHistory(prev => [...prev, { id: Date.now().toString(), text: inputMsg, type: 'input' }]);
              if (outputMsg) setHistory(prev => [...prev, { id: (Date.now() + 1).toString(), text: outputMsg, type: 'output' }]);
              transcriptionRef.current = { input: '', output: '' };
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            stopSession();
          },
          onclose: () => {
            setIsActive(false);
            setIsConnecting(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are Aether, a friendly real-time assistant. Keep responses concise for low latency.',
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (error) {
      console.error('Failed to start Live API session:', error);
      setIsConnecting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh] space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black tracking-tight gradient-text">Live Interaction</h2>
        <p className="text-white/40 max-w-md mx-auto">Ultra-low latency voice-to-voice conversation. No buttons, just speak.</p>
      </div>

      <div className="relative flex items-center justify-center">
        {/* Animated Rings */}
        {isActive && (
          <>
            <div className="absolute w-48 h-48 rounded-full border-2 border-blue-500/20 animate-ping"></div>
            <div className="absolute w-64 h-64 rounded-full border-2 border-purple-500/10 animate-ping" style={{ animationDelay: '500ms' }}></div>
          </>
        )}

        <button
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          className={`w-32 h-32 rounded-full glass border-4 flex items-center justify-center transition-all duration-500 group relative z-10 ${
            isActive 
              ? 'border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.3)]' 
              : 'border-blue-500/50 hover:border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]'
          }`}
        >
          {isConnecting ? (
            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : isActive ? (
            <svg className="w-12 h-12 text-red-500 animate-pulse-soft" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-12 h-12 text-blue-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="w-full glass rounded-3xl p-6 h-64 overflow-y-auto space-y-4 scrollbar-hide border border-white/10"
      >
        {history.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white/20 text-sm font-medium italic">
            Transcription history will appear here...
          </div>
        ) : (
          history.map((item) => (
            <div key={item.id} className={`flex ${item.type === 'input' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-xs ${
                item.type === 'input' 
                  ? 'bg-blue-600/10 text-blue-300 border border-blue-500/20 rounded-tr-none' 
                  : 'bg-white/5 text-white/70 border border-white/10 rounded-tl-none'
              }`}>
                {item.text}
              </div>
            </div>
          ))
        )}
      </div>

      {!isActive && !isConnecting && (
        <p className="text-white/30 text-xs text-center animate-bounce">Tap to start voice session</p>
      )}
    </div>
  );
};

export default LiveView;