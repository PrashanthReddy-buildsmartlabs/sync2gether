'use client';
import { useRef, useEffect, useState } from 'react';
import YouTube from 'react-youtube';

export default function VideoPlayer({ videoId, roomState, onStateChange, isHost, getServerTime }) {
    const playerRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [lastSeek, setLastSeek] = useState(0);

    // Sync Logic
    useEffect(() => {
        if (!playerRef.current || !roomState || !isReady) return;

        const player = playerRef.current;

        // Safety check: Ensure iframe exists in DOM
        try {
            const iframe = player.getIframe();
            if (!iframe || !iframe.isConnected) return;
        } catch (e) {
            // Player might be destroyed
            return;
        }

        try {
            // Calculate target time
            const now = getServerTime(); // Server time in ms
            const timeSinceUpdate = (now - roomState.timestamp) / 1000; // seconds
            const targetTime = roomState.status === 'playing'
                ? roomState.videoTime + timeSinceUpdate
                : roomState.videoTime;

            const currentTime = player.getCurrentTime();
            const drift = Math.abs(currentTime - targetTime);

            const playerState = player.getPlayerState(); // 1 = playing, 2 = paused, 3 = buffering, -1 = unstarted

            // Force Play if strictly required
            if (roomState.status === 'playing' && playerState !== 1 && playerState !== 3) {
                player.playVideo();
            } else if (roomState.status === 'paused' && playerState !== 2) {
                player.pauseVideo();
            }

            // Aggressive initial sync or standard drift correction
            const isInitialSync = lastSeek === 0;
            const threshold = isInitialSync ? 0.1 : 0.5; // Stricter sync on first load

            if (drift > threshold) {
                // Avoid seeking if we just sought (debounce), unless it's the very first sync
                if (isInitialSync || (Date.now() - lastSeek > 1000)) {
                    player.seekTo(targetTime, true);
                    setLastSeek(Date.now());
                }
            }
        } catch (error) {
            console.warn("YouTube Player Error:", error);
        }

    }, [roomState, isReady, getServerTime, lastSeek]);

    const onPlayerReady = (event) => {
        playerRef.current = event.target;
        setIsReady(true);
    };

    const onPlayerStateChange = (event) => {
        if (!isHost) return; // Only host updates state ?? Or anyone? 
        // If we want collaborative, anyone can be host.

        const player = event.target;
        const status = event.data === 1 ? 'playing' : event.data === 2 ? 'paused' : null;

        if (status) {
            onStateChange({
                status,
                videoTime: player.getCurrentTime(),
                // Timestamp added by useSync
            });
        }
    };

    const [origin, setOrigin] = useState('');

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
            controls: 1, // Show controls
            modestbranding: 1,
            origin: origin, // Fix for postMessage error
            host: 'https://www.youtube.com', // Hint for iframe origin
            mute: 1, // FORCE MUTED AUTOPLAY (Browser Policy Fix)
        },
    };

    return (
        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black relative group">
            {/* Overlay to Unmute often helpful */}
            {origin && (
                <YouTube
                    videoId={videoId}
                    opts={opts}
                    onReady={onPlayerReady}
                    onStateChange={onPlayerStateChange}
                    className="w-full h-full"
                />
            )}
        </div>
    );
}
