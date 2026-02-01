'use client';
import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, set, serverTimestamp, onDisconnect } from 'firebase/database';

export function useSync(roomId) {
    const [offset, setOffset] = useState(0);
    const [roomState, setRoomState] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    // 1. Calculate Clock Skew (Server Time Offset)
    useEffect(() => {
        const offsetRef = ref(db, '.info/serverTimeOffset');
        const unsubscribe = onValue(offsetRef, (snap) => {
            setOffset(snap.val() || 0);
        });

        const connectedRef = ref(db, '.info/connected');
        const unsubscribeConnected = onValue(connectedRef, (snap) => {
            setIsConnected(!!snap.val());
        });

        return () => {
            unsubscribe();
            unsubscribeConnected();
        };
    }, []);

    // 2. Listen to Room State
    useEffect(() => {
        if (!roomId) return;
        const roomRef = ref(db, `rooms/${roomId}/state`);
        const unsubscribe = onValue(roomRef, (snap) => {
            if (snap.exists()) {
                setRoomState(snap.val());
            }
        });

        // Cleanup on disconnect (optional logic can go here)
        return () => unsubscribe();
    }, [roomId]);

    // 3. Update Room State (Host controls)
    const updateRoomState = useCallback((newState) => {
        if (!roomId) return;
        set(ref(db, `rooms/${roomId}/state`), {
            ...newState,
            timestamp: serverTimestamp(), // Use server time for precision
        });
    }, [roomId]);

    // Helper to get current server time estimated
    const getServerTime = useCallback(() => {
        return Date.now() + offset;
    }, [offset]);

    return {
        roomState,
        updateRoomState,
        offset,
        getServerTime,
        isConnected
    };
}
