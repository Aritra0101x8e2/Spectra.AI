
import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Pause, Save, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface RetinaScanProps {
  onCapture: (imageData: string) => void;
  isProcessing: boolean;
}

const RetinaScan: React.FC<RetinaScanProps> = ({ onCapture, isProcessing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasCamera, setHasCamera] = useState(true);

  // Initialize webcam
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const initCamera = async () => {
      try {
        setIsInitializing(true);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamera(true);
        }
      } catch (error) {
        console.error('Error accessing webcam', error);
        setHasCamera(false);
        toast({
          title: "Camera Access Error",
          description: "Unable to access your camera. Please check permissions.",
          variant: "destructive"
        });
      } finally {
        setIsInitializing(false);
      }
    };
    
    initCamera();
    
    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    // Start scanning animation
    setTimeout(captureFrame, 2000); // Capture after 2 seconds of "scanning"
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas dimensions to video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0);
        
        // Get the image data as base64 string
        const imageData = canvas.toDataURL('image/png');
        
        // Pass the image data to the parent component
        onCapture(imageData);
        
        // Stop recording
        setIsRecording(false);
      }
    }
  };

  const resetScan = () => {
    setIsRecording(false);
  };

  return (
    <Card className="retina-card overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold text-retina-blue">Retina Scanner</h2>
          
          <div className={`retina-scanner w-64 h-64 relative ${isRecording ? 'retina-glow' : ''}`}>
            {isRecording && (
              <div className="retina-scan-line"></div>
            )}
            
            {isInitializing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCw className="w-10 h-10 text-retina-blue animate-spin" />
              </div>
            )}
            
            {!hasCamera && (
              <div className="absolute inset-0 flex items-center justify-center bg-retina-dark/80">
                <div className="text-center p-4">
                  <Camera className="w-10 h-10 text-retina-blue mx-auto mb-2" />
                  <p className="text-retina-light">Camera access denied</p>
                </div>
              </div>
            )}
            
            {/* Hidden video element */}
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full rounded-full object-cover"
            />
            
            {/* Hidden canvas for frame capture */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex gap-3">
            {!isRecording && !isProcessing && (
              <Button 
                onClick={startRecording} 
                disabled={isInitializing || !hasCamera || isProcessing}
                className="bg-retina-blue hover:bg-retina-accent text-white"
              >
                <Camera className="mr-2 h-4 w-4" />
                Scan Retina
              </Button>
            )}
            
            {isRecording && (
              <Button 
                onClick={resetScan} 
                variant="destructive"
              >
                <Pause className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">
            {isRecording ? 'Hold still while scanning...' : 
             isProcessing ? 'Processing scan data...' :
             'Position your eye in the center and click "Scan Retina"'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RetinaScan;
