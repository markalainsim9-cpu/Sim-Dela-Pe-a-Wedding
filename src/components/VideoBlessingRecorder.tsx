import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Camera, 
  Upload, 
  Square, 
  Play, 
  RotateCcw, 
  Check, 
  X, 
  Loader2, 
  Cloud, 
  AlertCircle,
  Film
} from 'lucide-react';
import { uploadVideoToR2, checkR2Status, R2StatusResponse } from '../utils/r2Client';

interface VideoBlessingRecorderProps {
  onVideoAttached: (videoUrl: string, duration?: number) => void;
  onCancel?: () => void;
  existingVideoUrl?: string;
}

export const VideoBlessingRecorder: React.FC<VideoBlessingRecorderProps> = ({
  onVideoAttached,
  onCancel,
  existingVideoUrl
}) => {
  const [mode, setMode] = useState<'record' | 'upload'>('record');
  const [r2Status, setR2Status] = useState<R2StatusResponse | null>(null);

  // Recording states
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedPreviewUrl, setRecordedPreviewUrl] = useState<string | null>(existingVideoUrl || null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Uploading states
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const videoLiveRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const MAX_RECORD_SECONDS = 60; // 1 minute max for guestbook clip

  useEffect(() => {
    checkR2Status().then(setR2Status);
  }, []);

  // Initialize camera when in record mode and not yet recorded
  useEffect(() => {
    if (mode === 'record' && !recordedPreviewUrl) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [mode, recordedPreviewUrl]);

  // Handle live video stream assignment
  useEffect(() => {
    if (videoLiveRef.current && stream) {
      videoLiveRef.current.srcObject = stream;
      videoLiveRef.current.play().catch(() => {});
    }
  }, [stream]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: true,
      });
      setStream(mediaStream);
    } catch (err: any) {
      console.warn('Camera initialization notice:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera access was denied. Please allow camera permissions or use the Upload Video tab instead.'
          : (err.message || 'Unable to access camera or microphone.')
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleStartCountdown = () => {
    setCountdown(3);
    const countInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countInterval);
          startActualRecording();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startActualRecording = () => {
    if (!stream) return;
    chunksRef.current = [];

    try {
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(chunksRef.current, { type: mimeType });
        setRecordedBlob(finalBlob);
        const url = URL.createObjectURL(finalBlob);
        setRecordedPreviewUrl(url);
        stopCamera();
      };

      recorder.start(500);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((sec) => {
          if (sec + 1 >= MAX_RECORD_SECONDS) {
            handleStopRecording();
            return MAX_RECORD_SECONDS;
          }
          return sec + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Failed to start media recorder:', err);
      setCameraError('Failed to record video on this device. Try the file upload option.');
    }
  };

  const handleStopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleRetake = () => {
    if (recordedPreviewUrl && recordedPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(recordedPreviewUrl);
    }
    setRecordedBlob(null);
    setRecordedPreviewUrl(null);
    setRecordingSeconds(0);
    setUploadError(null);
    startCamera();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setUploadError('Please select a valid video file (.mp4, .mov, .webm).');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setUploadError('Video file size exceeds 50MB. Please select a shorter video.');
      return;
    }

    setRecordedBlob(file);
    const url = URL.createObjectURL(file);
    setRecordedPreviewUrl(url);
    setUploadError(null);
  };

  const handleConfirmAndUpload = async () => {
    if (!recordedBlob) {
      if (recordedPreviewUrl) {
        // If already existing or local preview
        onVideoAttached(recordedPreviewUrl, recordingSeconds || undefined);
      }
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setUploadError(null);

    try {
      const ext = recordedBlob.type.includes('mp4') ? 'mp4' : 'webm';
      const fileName = `blessing_${Date.now()}.${ext}`;

      const res = await uploadVideoToR2(recordedBlob, fileName, (percent) => {
        setUploadProgress(percent);
      });

      if (res.success && res.publicUrl) {
        onVideoAttached(res.publicUrl, recordingSeconds || undefined);
      } else {
        // Even if remote R2 is unconfigured, attach local preview URL so guest can post
        onVideoAttached(res.publicUrl, recordingSeconds || undefined);
        if (res.error) {
          console.warn('R2 upload notice:', res.error);
        }
      }
    } catch (err: any) {
      console.error('Video upload failed:', err);
      setUploadError(err.message || 'Failed to upload video to Cloudflare R2.');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="bg-[#f8fafc] border border-[#c8d7e3] rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e2ecf4] pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#3A5A74] text-white flex items-center justify-center shadow-xs">
            <Film className="w-4 h-4 text-sky-200" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-[#18232c]">Video Blessing</h4>
            <p className="text-[11px] font-serif text-[#64748b]">
              Record or upload a 1-minute video keepsake for the couple
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        {!recordedPreviewUrl && (
          <div className="flex items-center bg-[#ebf2f7] p-0.5 rounded-xl border border-[#c8d7e3]">
            <button
              type="button"
              onClick={() => setMode('record')}
              className={`px-3 py-1 rounded-lg text-xs font-serif font-semibold transition flex items-center space-x-1 ${
                mode === 'record'
                  ? 'bg-white text-[#3A5A74] shadow-xs'
                  : 'text-[#64748b] hover:text-[#18232c]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-3 py-1 rounded-lg text-xs font-serif font-semibold transition flex items-center space-x-1 ${
                mode === 'upload'
                  ? 'bg-white text-[#3A5A74] shadow-xs'
                  : 'text-[#64748b] hover:text-[#18232c]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
          </div>
        )}

        {/* Cloudflare R2 Status Badge */}
        <div className="flex items-center space-x-1 text-[11px] font-serif text-[#3A5A74] bg-[#ebf2f7] px-2 py-0.5 rounded-full border border-[#c8d7e3]">
          <Cloud className="w-3 h-3 text-[#3A5A74]" />
          <span>{r2Status?.configured ? 'Cloudflare R2 Active' : 'R2 Video Storage'}</span>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="relative aspect-video max-h-72 w-full bg-slate-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
        {/* State A: Recorded Preview */}
        {recordedPreviewUrl ? (
          <video
            src={recordedPreviewUrl}
            controls
            playsInline
            className="w-full h-full object-cover"
          />
        ) : mode === 'record' ? (
          /* State B: Live Camera Preview */
          <>
            {cameraError ? (
              <div className="p-6 text-center text-white space-y-3 max-w-sm">
                <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
                <p className="text-xs font-serif leading-relaxed text-slate-200">
                  {cameraError}
                </p>
                <button
                  type="button"
                  onClick={() => setMode('upload')}
                  className="px-4 py-1.5 bg-[#3A5A74] hover:bg-[#274155] text-white rounded-lg text-xs font-serif font-semibold"
                >
                  Switch to Upload Video File
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoLiveRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />

                {/* Countdown Overlay */}
                {countdown !== null && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                    <span className="text-6xl font-serif text-white font-bold animate-ping">
                      {countdown}
                    </span>
                  </div>
                )}

                {/* Live Recording Indicator */}
                {isRecording && (
                  <div className="absolute top-3 left-3 z-10 flex items-center space-x-2 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-mono font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                    <span>REC {recordingSeconds}s / {MAX_RECORD_SECONDS}s</span>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          /* State C: File Upload Dropzone */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-slate-800 transition border-2 border-dashed border-slate-600 rounded-xl"
          >
            <Upload className="w-10 h-10 text-sky-300 mb-2" />
            <p className="text-sm font-serif font-semibold text-white">
              Click or drag a video blessing here
            </p>
            <p className="text-xs font-serif text-slate-400 mt-1">
              MP4, MOV, or WebM (Max 50MB, ~1-2 min)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        )}

        {/* Upload Progress Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-white z-30 space-y-3">
            <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
            <div className="text-center">
              <p className="text-sm font-serif font-semibold">
                Uploading Video to Cloudflare R2...
              </p>
              <p className="text-xs text-slate-300 font-mono mt-1">
                {uploadProgress !== null ? `${uploadProgress}%` : 'Processing...'}
              </p>
            </div>
            {uploadProgress !== null && (
              <div className="w-48 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-400 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {uploadError && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-serif flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div>
          {recordedPreviewUrl ? (
            <button
              type="button"
              onClick={handleRetake}
              disabled={isUploading}
              className="px-3 py-1.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] rounded-xl text-xs font-serif font-semibold transition flex items-center space-x-1.5 border border-[#cbd5e1]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Record / Select Another</span>
            </button>
          ) : (
            onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 text-xs font-serif text-[#64748b] hover:text-[#18232c]"
              >
                Cancel Video
              </button>
            )
          )}
        </div>

        <div>
          {recordedPreviewUrl ? (
            <button
              type="button"
              onClick={handleConfirmAndUpload}
              disabled={isUploading}
              className="px-4 py-2 bg-[#3A5A74] hover:bg-[#274155] text-white rounded-xl text-xs font-serif font-semibold transition shadow-xs flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4 text-emerald-300" />
              <span>{isUploading ? 'Uploading...' : 'Attach Video to Blessing'}</span>
            </button>
          ) : isRecording ? (
            <button
              type="button"
              onClick={handleStopRecording}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-serif font-semibold transition shadow-xs flex items-center space-x-1.5 animate-pulse"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>Stop Recording ({recordingSeconds}s)</span>
            </button>
          ) : (
            mode === 'record' &&
            !cameraError && (
              <button
                type="button"
                onClick={handleStartCountdown}
                disabled={!stream || countdown !== null}
                className="px-5 py-2 bg-[#3A5A74] hover:bg-[#274155] disabled:opacity-50 text-white rounded-xl text-xs font-serif font-semibold transition shadow-xs flex items-center space-x-1.5"
              >
                <Camera className="w-4 h-4 text-sky-200" />
                <span>{countdown !== null ? `Starting in ${countdown}...` : 'Start Recording'}</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
