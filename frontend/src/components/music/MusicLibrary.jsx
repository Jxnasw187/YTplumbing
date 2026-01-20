import { useState } from 'react';
import { Play, Pause, Music as MusicIcon, Volume2, Search, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const TRACKS = [
    { id: 1, title: 'Lo-Fi Chill Vibes', artist: 'Sunny Beats', duration: '2:30', tags: ['Chill', 'Study'] },
    { id: 2, title: 'Techno Energy', artist: 'Cyber Driver', duration: '3:15', tags: ['Energetic', 'Fast'] },
    { id: 3, title: 'Corporate Upgrade', artist: 'Biz Sound', duration: '1:45', tags: ['Neutral', 'Background'] },
    { id: 4, title: 'Cinematic Rise', artist: 'Epic Scores', duration: '2:50', tags: ['Dramatic'] },
    { id: 5, title: 'Happy Ukelele', artist: 'Smile Music', duration: '2:10', tags: ['Happy', 'Vlog'] },
];

export default function MusicLibrary() {
    const [playing, setPlaying] = useState(null);
    const [selected, setSelected] = useState(1);
    const [volume, setVolume] = useState(30);

    const togglePlay = (id) => setPlaying(playing === id ? null : id);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight text-white">Music Library</h2>
                <p className="text-white/60">100% Copyright-free tracks. Auto-ducking activated.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 size-4" />
                        <input
                            type="text"
                            placeholder="Search tracks, moods, styles..."
                            className="w-full bg-surface-highlight/50 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-white/30 transition-all hover:bg-surface-highlight"
                        />
                    </div>

                    <div className="space-y-2">
                        {TRACKS.map((track) => (
                            <div
                                key={track.id}
                                className={cn(
                                    "flex items-center p-3 rounded-2xl border transition-all cursor-pointer group",
                                    selected === track.id ? "bg-primary/10 border-primary/30" : "bg-white/5 border-transparent hover:bg-white/10"
                                )}
                                onClick={() => setSelected(track.id)}
                            >
                                <button
                                    onClick={(e) => { e.stopPropagation(); togglePlay(track.id); }}
                                    className={cn(
                                        "size-10 rounded-full flex items-center justify-center mr-4 transition-all duration-300",
                                        playing === track.id ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30" : "bg-surface-highlight text-white/40 group-hover:bg-white/20 group-hover:text-white"
                                    )}
                                >
                                    {playing === track.id ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <h4 className={cn("font-medium truncate transition-colors", selected === track.id ? "text-primary" : "text-white")}>{track.title}</h4>
                                    <p className="text-xs text-white/40 truncate">{track.artist}</p>
                                </div>

                                <div className="hidden sm:flex gap-2 mr-4">
                                    {track.tags.map(tag => (
                                        <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-white/40 border border-white/5">{tag}</span>
                                    ))}
                                </div>

                                <div className="text-xs text-white/40 w-10 text-right">{track.duration}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="sticky top-6">
                        <div className="h-32 bg-gradient-to-b from-primary/20 to-transparent flex items-center justify-center">
                            <MusicIcon className="size-16 text-primary/30" />
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="font-semibold text-white">Playback Settings</h3>
                                <p className="text-xs text-white/40">Control how music blends with voice.</p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60 flex items-center gap-2"><Volume2 className="size-4" /> Volume</span>
                                    <span className="text-white/60">{volume}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="100" value={volume}
                                    onChange={(e) => setVolume(e.target.value)}
                                    className="w-full h-1 bg-surface-highlight rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-sm text-white/60">Auto-Ducking</span>
                                <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer shadow-lg shadow-primary/20">
                                    <div className="absolute right-1 top-1 size-4 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
