import { useState, useEffect } from 'react';
import { Play, Download, Scissors, Layers, Check, Sparkles, FileText, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { endpoints } from '@/lib/api';

export default function Generation() {
    const [selectedClips, setSelectedClips] = useState([]);
    const [clips, setClips] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Changed to false initially
    const [script, setScript] = useState("");
    const [topic, setTopic] = useState("");

    const startGeneration = async () => {
        setIsLoading(true);
        setClips([]);
        try {
            // Mock IDs for MVP flow
            const res = await endpoints.generation.create({
                voice_model_id: 'mock_voice_id',
                material_id: 'mock_material_id',
                script_prompt: script // Passing script to backend
            });
            setClips(res.clips);
        } catch (err) {
            console.error("Generation failed", err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleClip = (id) => {
        setSelectedClips(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-white">Generation Studio</h2>
                    <p className="text-white/60">Combine your Voice + Materials into viral shorts.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Controls Config */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Sparkles className="size-5 text-primary" /> Controls</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/60">Topic / Focus</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Funny Moments, Key Takeaways"
                                    value={topic}
                                    onChange={e => setTopic(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/60 flex items-center justify-between">
                                    Custom Voiceover Script <span className="text-white/20 font-normal">(Optional)</span>
                                </label>
                                <textarea
                                    placeholder="Enter a specific script for the AI to read, or leave blank to auto-generate summary..."
                                    value={script}
                                    onChange={e => setScript(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-[120px] resize-none"
                                />
                            </div>

                            <div className="h-px bg-white/5 my-4" />

                            <Button
                                onClick={startGeneration}
                                size="lg"
                                className="w-full shadow-lg shadow-primary/20"
                                isLoading={isLoading}
                            >
                                {isLoading ? "Analyzing..." : <><Scissors className="mr-2 size-4" /> Generate Shorts</>}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Grid */}
                <div className="lg:col-span-3">
                    {isLoading ? (
                        <div className="h-96 flex flex-col items-center justify-center text-white/40 border border-dashed border-white/10 rounded-3xl bg-white/5">
                            <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
                            <p className="font-medium text-lg text-white">Creating Magic...</p>
                            <p className="text-sm">Analysing script • Cutting video • Syncing voice</p>
                        </div>
                    ) : clips.length > 0 ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center px-2">
                                <h3 className="text-xl font-bold text-white">{clips.length} Shorts Created</h3>
                                <Button variant="secondary" className="gap-2" onClick={() => alert("Export logic here")}>
                                    <Download className="size-4" /> Export Selected ({selectedClips.length})
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                {clips.map((clip, i) => (
                                    <motion.div
                                        key={clip.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-surface border border-white/5 hover:border-primary/50 transition-all shadow-[0_10px_30px_-5px_rgba(0,0,0,0.5)] cursor-pointer"
                                        onClick={() => toggleClip(clip.id)}
                                    >
                                        <div
                                            className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-60 transition-opacity"
                                            style={{ backgroundImage: `url(${clip.thumbnail})`, backgroundColor: '#1c1c1e' }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                                        <div className="absolute inset-0 p-4 flex flex-col justify-between">
                                            <div className="flex justify-end">
                                                <div className={cn(
                                                    "size-6 rounded-full border flex items-center justify-center transition-all duration-300",
                                                    selectedClips.includes(clip.id)
                                                        ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/40"
                                                        : "bg-black/40 border-white/30 text-transparent backdrop-blur hover:bg-white/20"
                                                )}>
                                                    <Check className="size-3.5" />
                                                </div>
                                            </div>

                                            <div className="space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 backdrop-blur text-primary border border-primary/20">
                                                        Voice On
                                                    </span>
                                                </div>
                                                <h4 className="font-semibold text-white leading-tight drop-shadow-md line-clamp-2">{clip.title}</h4>
                                                <div className="flex items-center justify-between text-xs text-white/60 pt-1">
                                                    <span>{clip.duration}</span>
                                                    <Play className="size-3 text-white/80 fill-white/80" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-96 flex flex-col items-center justify-center text-white/40 border-2 border-dashed border-white/5 rounded-3xl bg-surface-highlight/10">
                            <FileText className="size-12 mb-4 opacity-20" />
                            <p>No clips generated yet.</p>
                            <Button variant="link" className="text-primary mt-2" onClick={startGeneration}>
                                Start Demo Generation
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
