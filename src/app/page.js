'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
    const router = useRouter();
    const [roomId, setRoomId] = useState('');

    const createRoom = () => {
        const newRoomId = uuidv4().slice(0, 8); // Short ID for easier sharing
        router.push(`/room/${newRoomId}`);
    };

    const joinRoom = (e) => {
        e.preventDefault();
        if (roomId.trim()) {
            router.push(`/room/${roomId.trim()}`);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-4">
            <div className="max-w-md w-full text-center space-y-8">
                <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                    Sync2gether
                </h1>
                <p className="text-gray-400">
                    Watch videos in perfect sync with friends across any device.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={createRoom}
                        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all transform hover:scale-105"
                    >
                        Create New Room
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-700" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-gray-900 px-2 text-gray-500">Or join existing</span>
                        </div>
                    </div>

                    <form onSubmit={joinRoom} className="flex gap-2">
                        <input
                            type="text"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            placeholder="Enter Room Code"
                            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
                        >
                            Join
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
