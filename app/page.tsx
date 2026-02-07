"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, User, Droplets } from 'lucide-react';
import { EdgeNode } from '@/components/edge-node';
import { Interceptor } from '@/components/interceptor';
import { Ledger } from '@/components/ledger';
import { signPayload } from '@/lib/crypto';
import { Buffer } from 'buffer'; // Ensure you have this or use btoa()

export default function Home() {
  const [phValue, setPhValue] = useState(7.0);
  const [tempValue, setTempValue] = useState(22.4);
  const [interceptMode, setInterceptMode] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [packetStatus, setPacketStatus] = useState<'idle' | 'flying-edge' | 'intercepted' | 'flying-cloud'>('idle');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [lastVerifiedPh, setLastVerifiedPh] = useState(7.0);
  const [logs, setLogs] = useState<any[]>([]);

  // State for the packet currently in transit
  const [currentPacket, setCurrentPacket] = useState<any>(null);
  const [signedToken, setSignedToken] = useState<string>("");

  const generatePacket = async () => {
    const payload = {
      header: { device_id: "SN-8392-AX", timestamp: Math.floor(Date.now() / 1000) },
      payload: { type: "telemetry", data: { ph_value: phValue, temp_c: tempValue } } // Use current values
    };
    const token = await signPayload(payload);
    return { payload, token };
  };

  const handleTransmit = async () => {
    setIsTransmitting(true);
    setVerificationStatus('idle');
    const { payload, token } = await generatePacket();

    // Reset packet for the interceptor view
    setCurrentPacket(payload);
    setSignedToken(token);
    setPacketStatus('flying-edge');

    setTimeout(() => {
      if (interceptMode) {
        setPacketStatus('intercepted');
        setIsTransmitting(false);
      } else {
        processToCloud(token);
      }
    }, 1000);
  };

  // --- THE "REAL" ATTACK LOGIC ---
  const handleInject = async () => {
    setIsInjecting(true);
    setPacketStatus('flying-cloud');

    // 1. Split the valid token (Header . Payload . Signature)
    const parts = signedToken.split('.');

    // 2. Create the FAKE payload (Base64 URL Encoded) based on the user's edits
    const fakePayloadString = JSON.stringify(currentPacket);
    const fakePayloadB64 = Buffer.from(fakePayloadString).toString('base64')
      .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

    // 3. Reassemble: Valid Header + FAKE Payload + OLD Signature
    // This is a "Payload Tamper" attack. The signature no longer matches the data.
    const tamperedToken = `${parts[0]}.${fakePayloadB64}.${parts[2]}`;

    setTimeout(() => {
      processToCloud(tamperedToken);
      setIsInjecting(false);
    }, 1000);
  };

  const processToCloud = async (token: string) => {
    setPacketStatus('flying-cloud');
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const result = await res.json();

      setTimeout(() => {
        setPacketStatus('idle');
        setIsTransmitting(false);

        if (result.status === 'secure') {
          setVerificationStatus('success');
          // Only update the gauge if the data is verified!
          setLastVerifiedPh(result.data.payload.payload.data.ph_value);
        } else {
          setVerificationStatus('failed');
          // Do NOT update gauge - Block the data
        }

        const newLog = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toLocaleTimeString([], { hour12: false }),
          status: result.status === 'secure' ? 'verified' : 'compromised',
          hash: result.hash || 'INVALID-SIG',
          phValue: result.data?.payload?.payload?.data?.ph_value || 0
        };
        setLogs(prev => [newLog, ...prev].slice(0, 10));
      }, 800);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-blue-500/30">
      {/* Top Navbar */}
      <header className="h-16 border-b border-white/10 px-8 flex items-center justify-between bg-black/50 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-600 rounded-lg"><Droplets className="w-5 h-5 text-white" /></div>
          <div>
            <h1 className="text-sm font-black tracking-widest uppercase">HydroGuard</h1>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">made for system security project</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-xs text-zinc-500 font-black uppercase tracking-[0.2em]">Student</span>
            <span className="text-lg font-black tracking-tight text-white uppercase shadow-sm">Eyerusalem yonas lemma</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative max-w-[1600px] mx-auto w-full">

        {/* ANIMATION LAYER */}
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center">
          <AnimatePresence>
            {packetStatus === 'flying-edge' && (
              <motion.div
                key="packet-edge"
                initial={{ left: '16.66%', top: '50%', opacity: 0 }}
                animate={{ left: '50%', top: '168px', opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "linear" }}
                className="w-4 h-4 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,1)] absolute -ml-2"
              />
            )}
            {packetStatus === 'intercepted' && (
              <motion.div
                key="packet-stopped"
                initial={{ left: '50%', top: '168px', opacity: 1, scale: 1.5 }}
                animate={{
                  scale: [1.5, 1.8, 1.5],
                  backgroundColor: "#ef4444",
                  boxShadow: "0 0 25px rgba(239, 68, 68, 0.8)"
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-4 h-4 rounded-full absolute -ml-2"
              />
            )}
            {packetStatus === 'flying-cloud' && (
              <motion.div
                key="packet-cloud"
                initial={{ left: '50%', top: '168px', opacity: 1 }}
                animate={{ left: '83.33%', top: '50%', opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "linear" }}
                className={`w-4 h-4 rounded-full absolute -ml-2 ${interceptMode ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]' : 'bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,1)]'}`}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Zone A: Edge Node */}
        <div className="z-10">
          <EdgeNode
            phValue={phValue}
            setPhValue={setPhValue}
            tempValue={tempValue}
            setTempValue={setTempValue}
            onTransmit={handleTransmit}
            isTransmitting={isTransmitting}
          />
        </div>

        {/* Zone B: Interceptor */}
        <div className="z-10">
          <Interceptor
            interceptMode={interceptMode} setInterceptMode={setInterceptMode}
            payload={currentPacket || { header: {}, payload: { data: { ph_value: 0 } } }}
            onModify={(p) => setCurrentPacket(p)}
            onInject={handleInject} isInjecting={isInjecting}
          />
        </div>

        {/* Zone C: Ledger */}
        <div className="z-10">
          <Ledger lastVerifiedPh={lastVerifiedPh} logs={logs} verificationStatus={verificationStatus} />
        </div>
      </main>

      {/* Footer */}
      <footer className="h-10 border-t border-white/10 px-8 flex items-center justify-between bg-black/30 backdrop-blur-sm text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
        <div className="flex gap-6"><span>Server: aws-us-east-1</span><span>Latency: 24ms</span></div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /><span>MQTT Connected</span></div>
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /><span>Trust Registry Synced</span></div>
        </div>
      </footer>
    </div>
  );
}
