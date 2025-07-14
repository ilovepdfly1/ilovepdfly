import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { GoogleGenAI, Chat } from '@google/genai';
import { AIAssistantIcon, FileIcon, UserIcon, PaperAirplaneIcon, CopyIcon, RefreshIcon, MicrophoneIcon } from './icons';

// SpeechRecognition API type definitions for browsers that support it.
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition; };
    webkitSpeechRecognition: { new (): SpeechRecognition; };
  }
}

// Helper to convert File to a GoogleGenerativeAI.Part object.
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

const AIAssistant: React.FC = () => {
  const [mode, setMode] = useState<'pdf' | 'chat'>('pdf');

  // PDF Q&A States
  const [file, setFile] = useState<File | null>(null);
  const [pdfPrompt, setPdfPrompt] = useState<string>('');
  const [pdfResponse, setPdfResponse] = useState<string>('');
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string>('');

  // General Chat States
  const [geminiChat, setGeminiChat] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // New Feature States
  const [isListening, setIsListening] = useState(false);
  const [copiedTooltip, setCopiedTooltip] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setPdfResponse('');
      setPdfError('');
      setPdfPrompt('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });
  
  const initializeChat = useCallback(() => {
    if (!geminiChat) {
        const chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are a helpful and friendly AI assistant named PDFLY-AI. Answer user questions clearly and concisely.",
            },
        });
        setGeminiChat(chatInstance);
        if (chatMessages.length === 0) {
           setChatMessages([{ role: 'model', text: 'Hello! How can I help you today?' }]);
        }
    }
  }, [ai, geminiChat, chatMessages.length]);

  useEffect(() => {
    if (mode === 'chat' && !geminiChat) {
        initializeChat();
    }
  }, [mode, geminiChat, initializeChat]);
  
  useEffect(() => {
      if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
  }, [chatMessages]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        console.warn('Speech Recognition not supported by this browser.');
        return;
    }
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (mode === 'pdf') {
            setPdfPrompt(transcript);
        } else {
            setChatInput(transcript);
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        const errorSetter = mode === 'pdf' ? setPdfError : setChatError;
        errorSetter(`Voice recognition error: ${event.error}. Please ensure microphone permissions are granted.`);
    };
    
    recognition.onend = () => {
        setIsListening(false);
    };

    recognitionRef.current = recognition;
}, [mode]);


  const handleAskPdf = async () => {
    if (!pdfPrompt || !file) return;

    setIsPdfLoading(true);
    setPdfError('');
    setPdfResponse('');

    try {
      const pdfPart = await fileToGenerativePart(file);
      const textPart = { text: `User question: "${pdfPrompt}"` };
      
      const genAIResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [textPart, pdfPart] },
        config: {
          systemInstruction: "You are a helpful AI assistant specialized in analyzing and answering questions about PDF documents. Provide clear, concise answers based only on the content of the provided PDF file. If the question cannot be answered from the document, say so politely.",
          temperature: 0.3,
        }
      });
      
      setPdfResponse(genAIResponse.text);

    } catch (e: any) {
      console.error(e);
      setPdfError(`Sorry, an error occurred while processing the PDF. ${e.message || 'Please try again with a smaller file or a different document.'}`);
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || !geminiChat) return;

    const newMessages = [...chatMessages, { role: 'user' as const, text: chatInput }];
    setChatMessages(newMessages);
    const currentInput = chatInput;
    setChatInput('');
    setIsChatLoading(true);
    setChatError('');

    try {
        const response = await geminiChat.sendMessage({ message: currentInput });
        setChatMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch(e: any) {
        console.error(e);
        const errorMsg = `Sorry, an error occurred. ${e.message || 'Please try again.'}`;
        setChatError(errorMsg);
        setChatMessages(prev => [...prev, { role: 'model', text: errorMsg}]);
    } finally {
        setIsChatLoading(false);
    }
  };
  
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
        setCopiedTooltip(id);
        setTimeout(() => setCopiedTooltip(null), 2000);
    }).catch(err => console.error('Failed to copy text: ', err));
  };
  
  const handleNewChat = () => {
    setIsChatLoading(true);
    setChatError('');
    const chatInstance = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction: "You are a helpful and friendly AI assistant named PDFLY-AI. Answer user questions clearly and concisely." },
    });
    setGeminiChat(chatInstance);
    setChatMessages([{ role: 'model', text: 'New chat started. How can I help you?' }]);
    setIsChatLoading(false);
  };
  
  const handleVoiceSearch = () => {
    if (isListening || !recognitionRef.current) return;
    setIsListening(true);
    (mode === 'pdf' ? setPdfError : setChatError)('');
    recognitionRef.current.start();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPdfPrompt('');
    setPdfResponse('');
    setPdfError('');
  };
  
  const TabButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
  }> = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors focus:outline-none ${
        isActive
          ? 'bg-white dark:bg-black text-brand-red border-b-2 border-brand-red'
          : 'text-gray-500 dark:text-gray-400 hover:text-brand-red'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-8">
                 <div className="relative inline-block">
                    <AIAssistantIcon className="h-12 w-12 mx-auto text-brand-red" />
                    <span className="absolute inset-0 rounded-full animate-pulse-glow"></span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mt-4">
                    Your AI Assistant
                </h2>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                    Ask questions about a PDF or have a direct chat with our AI.
                </p>
            </div>

            <div className="animated-border rounded-xl">
                <div className="border-b border-gray-200 dark:border-gray-700 px-4 md:px-8 pt-4 flex">
                    <TabButton label="Chat with PDF" isActive={mode === 'pdf'} onClick={() => setMode('pdf')} />
                    <TabButton label="General Chat" isActive={mode === 'chat'} onClick={() => setMode('chat')} />
                </div>
                
                <div className="p-6 md:p-8">
                {mode === 'pdf' && (
                    <div>
                        {!file ? (
                            <div
                                {...getRootProps()}
                                className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-300 ${
                                    isDragActive ? 'border-brand-red bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-800 hover:border-brand-red'
                                }`}
                            >
                                <input {...getInputProps()} />
                                <p className="font-semibold text-gray-700 dark:text-gray-200">Drag & drop a PDF here, or click to select</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Max file size 10MB</p>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center justify-between p-3 mb-4 bg-gray-100 dark:bg-gray-900 rounded-md">
                                    <div className="flex items-center space-x-3 overflow-hidden">
                                        <FileIcon className="h-6 w-6 text-brand-red flex-shrink-0" />
                                        <span className="text-gray-800 dark:text-gray-200 font-medium truncate">{file.name}</span>
                                    </div>
                                    <button onClick={handleRemoveFile} className="text-gray-500 hover:text-red-500 transition-colors flex-shrink-0 ml-4">
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="text"
                                        value={pdfPrompt}
                                        onChange={(e) => setPdfPrompt(e.target.value)}
                                        placeholder="e.g., 'Summarize this document'"
                                        className="flex-grow w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-800 dark:text-gray-200 transition-shadow"
                                        disabled={isPdfLoading || isListening}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAskPdf()}
                                    />
                                    <button
                                        onClick={handleVoiceSearch}
                                        disabled={isPdfLoading || isListening}
                                        className={`p-3 rounded-md border bg-white dark:bg-black transition-colors flex-shrink-0 ${
                                            isListening 
                                            ? 'border-red-500 text-red-500 animate-pulse' 
                                            : 'border-gray-300 dark:border-gray-700 text-gray-400 hover:text-brand-red hover:border-brand-red'
                                        }`}
                                        aria-label="Use microphone"
                                    >
                                        <MicrophoneIcon className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={handleAskPdf}
                                        disabled={isPdfLoading || !pdfPrompt || isListening}
                                        className="bg-brand-red hover:bg-brand-red-dark text-white font-bold py-3 px-6 rounded-md transition-all duration-300 disabled:bg-red-300 dark:disabled:bg-red-800 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
                                    >
                                        {isPdfLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Asking...
                                            </>
                                        ) : 'Ask'}
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {pdfError && <div className="mt-4 text-center text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{pdfError}</div>}

                        {pdfResponse && (
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                 <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Answer:</h3>
                                    <div className="relative">
                                        <button onClick={() => handleCopyText(pdfResponse, 'pdf-response')} className="text-gray-400 hover:text-brand-red transition-colors" aria-label="Copy answer">
                                            <CopyIcon className="h-5 w-5" />
                                        </button>
                                        {copiedTooltip === 'pdf-response' && (
                                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded shadow-lg z-10">Copied!</span>
                                        )}
                                    </div>
                                </div>
                                <div className="prose prose-sm dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-md">
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{pdfResponse}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {mode === 'chat' && (
                    <div className="flex flex-col h-[60vh] max-h-[500px]">
                      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Conversation</h3>
                          <button onClick={handleNewChat} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-red transition-colors" aria-label="Start new chat">
                              <RefreshIcon className="h-4 w-4" />
                              New Chat
                          </button>
                      </div>
                      <div ref={chatContainerRef} className="flex-grow overflow-y-auto pr-4 space-y-6">
                        {chatMessages.map((msg, index) => (
                          <div key={index} className={`flex items-start gap-3 w-full group ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && (
                                <>
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-red/20 flex items-center justify-center"><AIAssistantIcon className="h-5 w-5 text-brand-red"/></div>
                                    <div className="p-3 rounded-lg max-w-md bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                                        <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                    </div>
                                    <div className="relative self-center">
                                        <button onClick={() => handleCopyText(msg.text, `chat-${index}`)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-brand-red transition-all duration-200" aria-label="Copy message">
                                            <CopyIcon className="h-4 w-4" />
                                        </button>
                                        {copiedTooltip === `chat-${index}` && (
                                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded shadow-lg z-10">Copied!</span>
                                        )}
                                    </div>
                                </>
                            )}
                             {msg.role === 'user' && (
                                <>
                                    <div className="p-3 rounded-lg max-w-md bg-blue-500 text-white">
                                      <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                    </div>
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"><UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-300"/></div>
                                </>
                            )}
                          </div>
                        ))}
                        {isChatLoading && (
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-red/20 flex items-center justify-center"><AIAssistantIcon className="h-5 w-5 text-brand-red"/></div>
                                <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-900 flex items-center">
                                    <span className="h-2 w-2 bg-brand-red rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-brand-red rounded-full animate-bounce [animation-delay:-0.15s] mx-1"></span>
                                    <span className="h-2 w-2 bg-brand-red rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}
                      </div>
                      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                           <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-grow w-full px-4 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-800 dark:text-gray-200 transition-shadow"
                                disabled={isChatLoading || isListening}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                            />
                            <button onClick={handleVoiceSearch} disabled={isChatLoading || isListening} className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${ isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-gray-400 hover:text-brand-red hover:border-brand-red' }`} aria-label="Use microphone">
                                <MicrophoneIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={handleSendChatMessage}
                                disabled={isChatLoading || !chatInput.trim() || isListening}
                                className="w-10 h-10 flex-shrink-0 bg-brand-red hover:bg-brand-red-dark text-white font-bold rounded-full transition-all duration-300 disabled:bg-red-300 dark:disabled:bg-red-800 disabled:cursor-not-allowed flex items-center justify-center"
                                aria-label="Send message"
                            >
                                <PaperAirplaneIcon className="h-5 w-5" />
                            </button>
                        </div>
                         {chatError && <p className="text-xs text-red-500 text-center mt-2">{chatError}</p>}
                      </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default AIAssistant;