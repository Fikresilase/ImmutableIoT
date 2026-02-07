"use client";

import React, { useEffect, useState } from 'react';
import { Database, ShieldCheck, ShieldX, Clock, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogEntry {
    id: string;
    timestamp: string;
    status: 'verified' | 'compromised';
    hash: string;
    phValue: number;
}

interface LedgerProps {
    lastVerifiedPh: number;
    logs: LogEntry[];
    verificationStatus: 'idle' | 'success' | 'failed';
}

export const Ledger: React.FC<LedgerProps> = ({ lastVerifiedPh, logs, verificationStatus }) => {
    return (
        <div className="glass-card flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                        <Database className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold tracking-wider uppercase">Immutable Ledger</h3>
                        <p className="text-[10px] text-zinc-500 font-mono">Status: Syncing Block #94012</p>
                    </div>
                </div>
                <div className="p-2 border border-white/10 rounded-full">
                    <Activity className="w-4 h-4 text-zinc-500" />
                </div>
            </div>

            {/* Verification Display */}
            <div className="p-8 flex flex-col items-center">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Speedometer Gauage */}
                    <svg className="absolute w-full h-full -rotate-[225deg]">
                        <circle
                            cx="96"
                            cy="96"
                            r="80"
                            fill="transparent"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="8"
                            strokeDasharray="377 502"
                        />
                        <motion.circle
                            cx="96"
                            cy="96"
                            r="80"
                            fill="transparent"
                            stroke={verificationStatus === 'failed' ? '#ef4444' : '#10b981'}
                            strokeWidth="8"
                            strokeDasharray="377 502"
                            animate={{ strokeDashoffset: 377 - (lastVerifiedPh / 14) * 377 }}
                            transition={{ type: "spring", stiffness: 40, damping: 15 }}
                            strokeLinecap="round"
                            className={verificationStatus === 'failed' ? "drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"}
                        />
                    </svg>

                    {/* Needle */}
                    <motion.div
                        className="absolute w-1 h-20 bg-white origin-bottom z-10 rounded-full shadow-lg"
                        style={{ top: '16px' }}
                        animate={{ rotate: (lastVerifiedPh / 14) * 270 - 135 }}
                        transition={{ type: "spring", stiffness: 40, damping: 15 }}
                    />

                    <div className="absolute top-[160px] text-center">
                        <AnimatePresence mode="wait">
                            {verificationStatus === 'success' ? (
                                <motion.div
                                    key="status-ok"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 font-bold text-[10px] uppercase tracking-wider">
                                        <ShieldCheck className="w-3 h-3" />
                                        Signature Valid
                                    </div>
                                    <div className="text-[9px] text-zinc-500">Public Key Verification Successful</div>
                                </motion.div>
                            ) : verificationStatus === 'failed' ? (
                                <motion.div
                                    key="status-error"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 font-bold text-[10px] uppercase tracking-wider">
                                        <ShieldX className="w-3 h-3" />
                                        Integrity Alert
                                    </div>
                                    <div className="text-[9px] text-red-400 font-bold">WARNING: SIGNATURE MISMATCH</div>
                                </motion.div>
                            ) : (
                                <div key="status-idle" className="flex flex-col items-center gap-1">
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-zinc-500 font-bold text-[10px] uppercase tracking-wider">
                                        <Activity className="w-3 h-3" />
                                        System Monitoring
                                    </div>
                                    <div className="text-[9px] text-zinc-500 italic">Waiting for telemetry...</div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Logs Section */}
            <div className="flex-1 mt-6 flex flex-col min-h-0 border-t border-white/5 bg-black/20">
                <div className="px-6 py-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Verification Log</span>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 scrollbar-hide">
                    <AnimatePresence initial={false}>
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-3 rounded-lg flex items-center gap-4 border ${log.status === 'verified' ? 'bg-green-500/5 border-green-500/10' : 'bg-red-500/5 border-red-500/10'}`}
                            >
                                <div className="text-[10px] font-mono text-zinc-500">{log.timestamp}</div>
                                <div className="flex-1">
                                    <div className={`text-[11px] font-bold ${log.status === 'verified' ? 'text-green-400' : 'text-red-400'}`}>
                                        {log.status === 'verified' ? 'Integrity Check Passed' : 'Verification Failure'}
                                    </div>
                                    <div className="text-[9px] text-zinc-600 font-mono">Hash: {log.hash}</div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {logs.length === 0 && (
                        <div className="h-full flex items-center justify-center text-zinc-700 text-[10px] font-bold uppercase tracking-widest py-10">
                            Log Empty
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
