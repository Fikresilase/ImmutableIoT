"use client";

import React, { useState, useEffect } from 'react';
import { Terminal, ShieldAlert, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InterceptorProps {
    interceptMode: boolean;
    setInterceptMode: (mode: boolean) => void;
    payload: any;
    onModify: (newPayload: any) => void;
    onInject: () => void;
    isInjecting: boolean;
}

export const Interceptor: React.FC<InterceptorProps> = ({
    interceptMode,
    setInterceptMode,
    payload,
    onModify,
    onInject,
    isInjecting
}) => {
    const [localJson, setLocalJson] = useState(JSON.stringify(payload, null, 2));

    useEffect(() => {
        setLocalJson(JSON.stringify(payload, null, 2));
    }, [payload]);

    const handleJsonChange = (val: string) => {
        setLocalJson(val);
        try {
            const parsed = JSON.parse(val);
            onModify(parsed);
        } catch (e) {
            // Invalid JSON, don't update parent yet
        }
    };

    return (
        <div className="glass-card flex flex-col h-full overflow-hidden border-zinc-800">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 rounded-lg">
                        <Terminal className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold tracking-wider uppercase">Network Interceptor (MITM)</h3>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
            </div>

            {/* Network Visualization Area */}
            <div className="h-24 bg-black/40 border-b border-white/5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <div className="w-[200%] h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[pulse_4s_infinite]" />
                </div>

                <div className="w-full px-12 relative h-full flex items-center">
                    {/* Visual line representation */}
                    <div className="w-full h-[1px] bg-zinc-800" />
                    <motion.div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)] z-10 cursor-help"
                        animate={interceptMode ? {
                            scale: [1, 1.2, 1],
                            backgroundColor: "#ef4444",
                            boxShadow: "0 0 20px rgba(239, 68, 68, 0.8)"
                        } : {
                            scale: 1,
                            backgroundColor: "#3b82f6",
                            boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)"
                        }}
                    />

                    <div className="absolute right-12 bottom-2 text-[8px] font-mono text-zinc-600 uppercase">
                        Protocol: MQTT/TLS 1.3
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="p-6 bg-zinc-900/50 border-b border-white/5 flex items-center justify-between">
                <div>
                    <div className="text-[10px] font-bold text-white uppercase tracking-wider mb-1">Intercept Mode</div>
                    <div className="text-[10px] text-zinc-500">Enable to modify payload in transit</div>
                </div>
                <button
                    onClick={() => setInterceptMode(!interceptMode)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${interceptMode ? 'bg-red-500' : 'bg-zinc-700'}`}
                >
                    <motion.div
                        className="w-4 h-4 bg-white rounded-full shadow-lg"
                        animate={{ x: interceptMode ? 24 : 0 }}
                    />
                </button>
            </div>

            {/* Code Editor */}
            <div className="flex-1 p-6 font-mono text-xs overflow-auto bg-[#0d1117] relative">
                <div className="absolute right-4 top-4 px-2 py-0.5 bg-zinc-800 text-zinc-500 rounded text-[9px] font-bold">JSON</div>
                <textarea
                    readOnly={!interceptMode}
                    value={localJson}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    className={`w-full h-full bg-transparent outline-none resize-none transition-opacity ${interceptMode ? 'opacity-100 text-green-400' : 'opacity-60 text-blue-300'}`}
                    spellCheck={false}
                />

                {/* Overlay when not in intercept mode */}
                {!interceptMode && (
                    <div className="absolute inset-0 bg-blue-500/5 pointer-events-none flex items-center justify-center">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                            <ShieldAlert className="w-3 h-3 text-blue-400" />
                            <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider">Passive Monitoring</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Area */}
            <AnimatePresence>
                {interceptMode && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-4 bg-red-950/20 border-t border-red-500/20"
                    >
                        <button
                            onClick={onInject}
                            disabled={isInjecting}
                            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-red-500/20"
                        >
                            <Cpu className="w-4 h-4" />
                            INJECT MALICIOUS PAYLOAD
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
