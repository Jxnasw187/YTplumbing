import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Film, Music, CheckCircle2, Activity, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { endpoints } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

export default function MaterialUpload() {
    const [videoFile, setVideoFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisSteps, setAnalysisSteps] = useState([]);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const navigate = useNavigate();

    const onDropVideo = useCallback(files => setVideoFile(files[0]), []);
    const onDropAudio = useCallback(files => setAudioFile(files[0]), []);

    const { getRootProps: getVideoProps, getInputProps: getVideoInput, isDragActive: videoActive } = useDropzone({
        onDrop: onDropVideo, accept: { 'video/*': [] }, maxFiles: 1
    });

    const { getRootProps: getAudioProps, getInputProps: getAudioInput, isDragActive: audioActive } = useDropzone({
        onDrop: onDropAudio, accept: { 'audio/*': [] }, maxFiles: 1
    });

    const startAnalysis = async () => {
        if (!videoFile) return;
        setIsAnalyzing(true);
        setAnalysisSteps([]);

        // 1. Upload Video to Backend
        try {
            const formData = new FormData();
            formData.append('file', videoFile);

            // Start "Analysis" UI while uploading
            const steps = [
                "Uploading content...",
                "Extracting Audio Track...",
                "Detecting Volume Peaks & Silences...",
                "Identifying Scene Changes...",
                "Optimizing for Short Form (9:16)..."
            ];

            let stepIdx = 0;
            const interval = setInterval(() => {
                if (stepIdx < steps.length) {
                    setAnalysisSteps(prev => [...prev, steps[stepIdx]]);
                    stepIdx++;
                } else {
                    clearInterval(interval);
                }
            }, 1200);

            await endpoints.materials.upload(formData);

            setTimeout(() => {
                setIsAnalyzing(false);
                setAnalysisComplete(true);
                setAnalysisSteps(steps);
            }, 6000);

        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Check backend.");
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold tracking-tight text-white">Input Materials</h2>
                    <p className="text-white/60">Upload your raw footage. We'll automatically find the best moments.</p>
                </div>
                {analysisComplete && (
                    <Button onClick={() => navigate('/generate')} className="gap-2 animate-in fade-in slide-in-from-right-4">
                        Next Step: Generation <ArrowRight className="size-4" />
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Source Video</CardTitle>
                        <CardDescription>Primary video footage (e.g. 1 hour podcast/gameplay)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div
                            {...getVideoProps()}
                            className={cn(
                                "h-64 border border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer",
                                videoActive ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/30 hover:bg-white/5",
                                videoFile && "border-primary/50 bg-primary/5"
                            )}
                        >
                            <input {...getVideoInput()} />
                            {videoFile ? (
                                <div className="text-center space-y-2">
                                    <Film className="size-10 text-primary mx-auto" />
                                    <p className="font-medium text-primary">{videoFile.name}</p>
                                    <p className="text-sm text-white/50">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
                                </div>
                            ) : (
                                <div className="text-center space-y-2">
                                    <div className="p-3 bg-surface-highlight rounded-full inline-block">
                                        <Upload className="size-6 text-white/40" />
                                    </div>
                                    <p className="text-white/70 font-medium">Drop Video File</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>External Audio (Optional)</CardTitle>
                        <CardDescription>Separate microphone recording if available</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div
                            {...getAudioProps()}
                            className={cn(
                                "h-64 border border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer",
                                audioActive ? "border-secondary bg-secondary/5" : "border-white/10 hover:border-white/30 hover:bg-white/5",
                                audioFile && "border-success/50 bg-success/5"
                            )}
                        >
                            <input {...getAudioInput()} />
                            {audioFile ? (
                                <div className="text-center space-y-2">
                                    <Music className="size-10 text-success mx-auto" />
                                    <p className="font-medium text-success">{audioFile.name}</p>
                                    <p className="text-sm text-white/50">{(audioFile.size / 1024 / 1024).toFixed(1)} MB</p>
                                </div>
                            ) : (
                                <div className="text-center space-y-2">
                                    <div className="p-3 bg-surface-highlight rounded-full inline-block">
                                        <Upload className="size-6 text-white/40" />
                                    </div>
                                    <p className="text-white/70 font-medium">Drop Audio File</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {(videoFile || audioFile) && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="border-t-4 border-t-primary">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Analysis & Processing</CardTitle>
                                    <CardDescription>Ready to inspect content</CardDescription>
                                </div>
                                <Button onClick={startAnalysis} disabled={isAnalyzing || analysisComplete} size="lg">
                                    {isAnalyzing ? (
                                        <>Analyzing...</>
                                    ) : analysisComplete ? (
                                        <><CheckCircle2 className="mr-2" /> Analysis Complete</>
                                    ) : (
                                        <><Activity className="mr-2" /> Start Analysis</>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        {analysisSteps.length > 0 && (
                            <CardContent className="space-y-3">
                                {analysisSteps.map((step, i) => (
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                                    >
                                        <CheckCircle2 className="size-5 text-success" />
                                        <span className="text-white/80 text-sm">{step}</span>
                                    </motion.div>
                                ))}
                            </CardContent>
                        )}
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
