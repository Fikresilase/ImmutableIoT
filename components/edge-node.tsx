"use client";

import React from 'react';
import { Radio, ShieldCheck, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

interface EdgeNodeProps {
    phValue: number;
    setPhValue: (val: number) => void;
    onTransmit: () => void;
    isTransmitting: boolean;
}

export const EdgeNode: React.FC<EdgeNodeProps> = ({ phValue, setPhValue, onTransmit, isTransmitting }) => {
    return (
        <div className="glass-card flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Radio className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold tracking-wider uppercase">Edge Node 01</h3>
                        <p className="text-[10px] text-zinc-500 font-mono">ID: SN-8392-AX</p>
                    </div>
                </div>
                <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] text-blue-400 font-mono">
                    v2.4.1
                </div>
            </div>

            {/* Sensor Display */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Progress Ring Background */}
                    <svg className="absolute w-full h-full -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r="80"
                            fill="transparent"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="8"
                        />
                        {/* Dynamic Progress Ring */}
                        <motion.circle
                            cx="96"
                            cy="96"
                            r="80"
                            fill="transparent"
                            stroke="#3b82f6"
                            strokeWidth="8"
                            strokeDasharray="502.4"
                            animate={{ strokeDashoffset: 502.4 - (phValue / 14) * 502.4 }}
                            transition={{ type: "spring", stiffness: 50, damping: 20 }}
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                        />
                    </svg>

                    <div className="text-center z-10">
                        <motion.div
                            key={phValue}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-black font-mono tracking-tighter"
                        >
                            {phValue.toFixed(1)}
                        </motion.div>
                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                            pH Level
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-8 flex justify-between w-full text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    <span>Acidic</span>
                    <span>Neutral</span>
                    <span>Alkaline</span>
                </div>

                {/* Slider */}
                <div className="mt-4 w-full">
                    <input
                        type="range"
                        min="0"
                        max="14"
                        step="0.1"
                        value={phValue}
                        onChange={(e) => setPhValue(parseFloat(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
            </div>

            {/* Footer Info */}
            <div className="px-4 py-3 bg-black/40 border-t border-white/5 mx-4 mb-4 rounded-xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Fingerprint className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-yellow-500 uppercase">Private Key Loaded</div>
                        <div className="text-[9px] text-zinc-500 font-mono">0x8F...3A21 (Hardware Enclave)</div>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={onTransmit}
                disabled={isTransmitting}
                className="mx-4 mb-4 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] relative overflow-hidden group shadow-lg shadow-blue-500/20"
            >
                <span className="z-10 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    SIGN & TRANSMIT
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            </button>
        </div>
    );
};
