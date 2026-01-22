import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Mic, Upload, Play, Check, Wand2, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { endpoints } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

export default function VoiceCloning() {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [generatedVoice, setGeneratedVoice] = useState(null);
    const [testText, setTestText] = useState("Hey there... sweetie. You've been working so hard, haven't you? It's okay to rest now... I'm here.");
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // TTS Parameters for ASMR-style control
    const [temperature, setTemperature] = useState(0.3);  // Lower = more stable
    const [lengthPenalty, setLengthPenalty] = useState(1.8);
    const [repetitionPenalty, setRepetitionPenalty] = useState(3.0);
    const [topK, setTopK] = useState(50);
    const [topP, setTopP] = useState(0.85);
    const [sentenceSplit, setSentenceSplit] = useState(true);
    const [lastAudioUrl, setLastAudioUrl] = useState(null);

    const navigate = useNavigate();

    const onDrop = useCallback(acceptedFiles => {
        setFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'audio/*': [] },
        maxFiles: 1
    });

    const handleClone = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // 1. Upload Reference
            const uploadRes = await endpoints.voice.upload(formData);

            // 2. Mock "Train" trigger (Local is instant)
            const trainFormData = new FormData();
            trainFormData.append('voice_id', uploadRes.voice_id);

            const trainRes = await endpoints.voice.train(trainFormData);

            setGeneratedVoice({
                id: trainRes.model_id,
                name: uploadRes.voice_id,
                url: '#'
            });
        } catch (err) {
            console.error("Failed to clone voice", err);
            alert("Failed to upload/train voice. Check backend.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTestVoice = async () => {
        if (!generatedVoice) return;
        if (isPlaying) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            setIsPlaying(false);
            return;
        }

        setIsPlaying(true);
        try {
            const formData = new FormData();
            formData.append('voice_id', generatedVoice.id);
            formData.append('text', testText);
            // Send TTS parameters
            formData.append('temperature', temperature);
            formData.append('length_penalty', lengthPenalty);
            formData.append('repetition_penalty', repetitionPenalty);
            formData.append('top_k', topK);
            formData.append('top_p', topP);
            formData.append('sentence_split', sentenceSplit);

            const res = await endpoints.voice.preview(formData);

            if (res.audio_url) {
                setLastAudioUrl(res.audio_url); // Save for download
                const audio = new Audio(res.audio_url);
                audioRef.current = audio;
                audio.onended = () => setIsPlaying(false);
                audio.play().catch(e => {
                    console.error("Playback failed", e);
                    setIsPlaying(false);
                });
            }
        } catch (err) {
            console.error("Preview failed", err);
            alert("Failed to generate preview. Make sure backend is running with TTS.");
            setIsPlaying(false);
        }
    };

    const handleDownload = () => {
        if (!lastAudioUrl) return;
        const link = document.createElement('a');
        link.href = lastAudioUrl;
        link.download = `voice_preview_${Date.now()}.wav`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold tracking-tight text-white">Voice Lab</h2>
                    <p className="text-white/60">Create a digital twin of your voice using Local AI (Coqui TTS).</p>
                </div>
                {generatedVoice && (
                    <Button onClick={() => navigate('/materials')} className="gap-2 animate-in fade-in slide-in-from-right-4">
                        Next Step: Materials <ArrowRight className="size-4" />
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Upload & Input */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Reference Audio</CardTitle>
                            <CardDescription>Upload a clear recording of your voice (WAV/MP3).</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                {...getRootProps()}
                                className={cn(
                                    "border border-dashed rounded-2xl p-10 transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer group",
                                    isDragActive ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/30 hover:bg-white/5",
                                    file && "border-success/50 bg-success/5"
                                )}
                            >
                                <input {...getInputProps()} />
                                <div className={cn("p-4 rounded-full bg-surface-highlight group-hover:bg-white/20 transition-colors", file && "bg-success/20")}>
                                    {file ? <Check className="size-8 text-success" /> : <Upload className="size-8 text-white/40 group-hover:text-primary transition-colors" />}
                                </div>
                                <div className="text-center space-y-1">
                                    {file ? (
                                        <>
                                            <p className="text-lg font-medium text-success">{file.name}</p>
                                            <p className="text-sm text-white/50">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-lg font-medium text-white/80">Drag & Drop Audio</p>
                                            <p className="text-sm text-white/50">WAV recommended for best results</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <AnimatePresence>
                        {file && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Voice Settings</CardTitle>
                                        <CardDescription>Fine-tune the voice generation parameters</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Temperature */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-medium text-white/70">Temperature</label>
                                                <span className="text-xs text-primary font-mono">{temperature.toFixed(2)}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="1.0"
                                                step="0.05"
                                                value={temperature}
                                                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                                className="w-full h-1 bg-surface-highlight rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <p className="text-xs text-white/40">Lower = softer, more consistent (ASMR). Higher = more expressive.</p>
                                        </div>

                                        {/* Length Penalty */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-medium text-white/70">Speaking Pace</label>
                                                <span className="text-xs text-primary font-mono">{lengthPenalty.toFixed(2)}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.5"
                                                max="2.0"
                                                step="0.1"
                                                value={lengthPenalty}
                                                onChange={(e) => setLengthPenalty(parseFloat(e.target.value))}
                                                className="w-full h-1 bg-surface-highlight rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <p className="text-xs text-white/40">Higher = slower, more relaxed. Lower = faster pace.</p>
                                        </div>

                                        {/* Repetition Penalty */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-medium text-white/70">Repetition Control</label>
                                                <span className="text-xs text-primary font-mono">{repetitionPenalty.toFixed(1)}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="1.0"
                                                max="10.0"
                                                step="0.5"
                                                value={repetitionPenalty}
                                                onChange={(e) => setRepetitionPenalty(parseFloat(e.target.value))}
                                                className="w-full h-1 bg-surface-highlight rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <p className="text-xs text-white/40">Higher = prevents word repetitions. Keep at 2-5 for natural speech.</p>
                                        </div>

                                        {/* Top K */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-medium text-white/70">Diversity (Top-K)</label>
                                                <span className="text-xs text-primary font-mono">{topK}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="10"
                                                max="100"
                                                step="5"
                                                value={topK}
                                                onChange={(e) => setTopK(parseInt(e.target.value))}
                                                className="w-full h-1 bg-surface-highlight rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <p className="text-xs text-white/40">Lower = more focused. Higher = more variety in pronunciation.</p>
                                        </div>

                                        {/* Top P */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-medium text-white/70">Naturalness (Top-P)</label>
                                                <span className="text-xs text-primary font-mono">{topP.toFixed(2)}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.5"
                                                max="1.0"
                                                step="0.05"
                                                value={topP}
                                                onChange={(e) => setTopP(parseFloat(e.target.value))}
                                                className="w-full h-1 bg-surface-highlight rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <p className="text-xs text-white/40">Controls sampling randomness. 0.85-0.95 recommended for natural flow.</p>
                                        </div>

                                        {/* Sentence Split Toggle */}
                                        <div className="space-y-2 pt-2 border-t border-white/5">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-medium text-white/70">Natural Pauses</label>
                                                <button
                                                    onClick={() => setSentenceSplit(!sentenceSplit)}
                                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${sentenceSplit
                                                        ? 'bg-primary/20 text-primary border border-primary/30'
                                                        : 'bg-white/5 text-white/40 border border-white/10'
                                                        }`}
                                                >
                                                    {sentenceSplit ? 'ON' : 'OFF'}
                                                </button>
                                            </div>
                                            <p className="text-xs text-white/40">Adds natural pauses between sentences. Recommended for ASMR.</p>
                                        </div>

                                        {/* ASMR Script Tips */}
                                        <div className="space-y-2 pt-2 border-t border-white/5">
                                            <p className="text-xs font-medium text-white/50">💡 ASMR Script Tips:</p>
                                            <ul className="text-xs text-white/40 space-y-1 list-disc list-inside">
                                                <li>Use <code className="text-primary/70">...</code> for longer pauses</li>
                                                <li>Use <code className="text-primary/70">,</code> for short breaths</li>
                                                <li>Short sentences = more natural</li>
                                                <li>Try: "Hey... sweetie. Rest now..."</li>
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Col: Output & Actions */}
                <div className="space-y-6">
                    <Card className="h-full border-primary/20 shadow-[0_0_30px_-10px_rgba(10,132,255,0.15)]">
                        <CardHeader>
                            <CardTitle>Generation</CardTitle>
                            <CardDescription>Ready to clone your voice?</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-6">
                            {generatedVoice ? (
                                <div className="p-5 rounded-2xl bg-success/10 border border-success/20 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-success flex items-center justify-center text-black">
                                            <Mic className="size-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-success">Clone Ready</p>
                                            <p className="text-xs text-success/60">Local AI Model Loaded</p>
                                        </div>
                                    </div>

                                    <div className="mt-2 space-y-2">
                                        <label className="text-xs text-white/40 font-medium ml-1">Test Sentence</label>
                                        <textarea
                                            value={testText}
                                            onChange={(e) => setTestText(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-success/50 resize-none h-24"
                                            placeholder="Type your ASMR script... Sentences split at: . ? !"
                                        />
                                        <p className="text-xs text-white/30">💡 Pauses added automatically at punctuation</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleTestVoice}
                                            variant="outline"
                                            size="sm"
                                            className={cn("flex-1 border-success/30 hover:bg-success/20 text-success-300 transition-all", isPlaying && "bg-success/20 border-success/50")}
                                        >
                                            {isPlaying ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Play className="mr-2 size-4" />}
                                            {isPlaying ? "Generating..." : "Test Voice"}
                                        </Button>
                                        <Button
                                            onClick={handleDownload}
                                            variant="outline"
                                            size="sm"
                                            disabled={!lastAudioUrl}
                                            className="border-primary/30 hover:bg-primary/20 text-primary disabled:opacity-30"
                                            title="Download last generated audio"
                                        >
                                            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 rounded-2xl bg-surface-highlight/30 border border-white/5 border-dashed text-center">
                                    <p className="text-white/40 text-sm mb-4">No model generated yet</p>
                                    <Wand2 className="size-8 text-white/20 mx-auto" />
                                </div>
                            )}

                            <Button
                                className="w-full py-6 text-lg shadow-xl shadow-primary/20"
                                disabled={!file || isProcessing}
                                onClick={handleClone}
                                variant={generatedVoice ? "secondary" : "primary"}
                                isLoading={isProcessing}
                            >
                                {isProcessing ? 'Processing Model...' : generatedVoice ? 'Re-Clone Voice' : 'Clone Voice'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
