'use client';
import { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import { useSync } from '@/hooks/useSync';

export default function SyncRoom({ roomId }) {
    const { roomState, updateRoomState, offset, getServerTime, isConnected } = useSync(roomId);
    const [videoUrl, setVideoUrl] = useState('');
    const [videoId, setVideoId] = useState('dQw4w9WgXcQ'); // Default demo

    // Extract video ID from URL
    const loadVideo = (e) => {
        e.preventDefault();
        try {
            const url = new URL(videoUrl);
            const id = url.searchParams.get('v') || url.pathname.split('/').pop();
            if (id) {
                setVideoId(id);
                updateRoomState({
                    ...roomState,
                    status: 'playing',
                    videoTime: 0,
                    videoId: id, // Broadcast new video ID
                    // timestamp added by updateRoomState
                });
            }
        } catch (err) {
            console.error("Invalid URL");
        }
    };

    // Sync video ID from room state
    useEffect(() => {
        if (roomState?.videoId && roomState.videoId !== videoId) {
            setVideoId(roomState.videoId);
        }
    }, [roomState, videoId]);

    return (
        <div className="flex flex-col items-center min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black text-white p-4">
            <header className="w-full max-w-4xl flex justify-between items-center mb-8 p-4 glass rounded-2xl sticky top-4 z-50">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    Sync2gether
                </h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-black/30 rounded-full border border-white/5">
                        <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                        <span className="text-xs text-gray-400 font-mono">{offset}ms</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-lg text-sm font-mono tracking-wider select-all hover:bg-white/10 transition-colors cursor-pointer" title="Room ID">
                        {roomId}
                    </div>
                </div>
            </header>

            <main className="w-full max-w-5xl space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="glass-card p-1 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                    <VideoPlayer
                        videoId={videoId}
                        roomState={roomState}
                        onStateChange={updateRoomState}
                        isHost={true}
                        getServerTime={getServerTime}
                    />
                </div>

                <form onSubmit={loadVideo} className="glass p-2 rounded-xl flex gap-2 max-w-2xl mx-auto ring-1 ring-white/5">
                    <input
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="Paste YouTube Link"
                        className="flex-1 px-6 py-3 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
                    />
                    <button type="submit" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg font-medium transition-all shadow-lg hover:shadow-blue-500/20">
                        Load Video
                    </button>
                </form>
            </main>
        </div>
    );
}
