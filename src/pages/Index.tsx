
import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import RetinaScan from '@/components/RetinaScan';
import RetinaAnalysis from '@/components/RetinaAnalysis';
import ScanResult from '@/components/ScanResult';
import RetinaDashboard from '@/components/RetinaDashboard';
import { 
  analyzeRetinaImage, 
  compareRetina, 
  generateGraphData 
} from '@/utils/retinaAnalyzer';
import {
  saveRetinaData,
  getStoredRetinaData,
  hasStoredRetinaData
} from '@/utils/retinaStorage';

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastScanDate, setLastScanDate] = useState<Date | undefined>();
  
  const [currentScan, setCurrentScan] = useState<{
    imageData: string;
    patterns: number[];
    signaturePoints: {x: number, y: number, intensity: number}[];
    id: string;
  } | null>(null);
  
  const [matchResult, setMatchResult] = useState<{
    success: boolean;
    score: number;
  } | null>(null);
  useEffect(() => {
    const storedData = getStoredRetinaData();
    if (storedData) {
      setLastScanDate(new Date(storedData.timestamp));
    }
  }, []);
  const handleCapture = (imageData: string) => {
    setIsProcessing(true);
    setIsScanning(true);
    
    setTimeout(() => {
      const analysis = analyzeRetinaImage(imageData);
      
      setCurrentScan({
        imageData,
        patterns: analysis.patterns,
        signaturePoints: analysis.signaturePoints,
        id: analysis.id
      });
      
      const storedData = getStoredRetinaData();
      if (storedData) {
        const score = compareRetina(
          {
            patterns: storedData.patterns,
            signaturePoints: storedData.signaturePoints
          },
          {
            patterns: analysis.patterns,
            signaturePoints: analysis.signaturePoints
          }
        );
        
        setMatchResult({
          success: score > 80, 
          score: score
        });
      }
      
      setIsProcessing(false);
      setShowResult(true);
    }, 2000);
  };

  const handleSaveData = () => {
    if (!currentScan) return;
    
    const dataToSave = {
      id: currentScan.id,
      timestamp: Date.now(),
      imageData: currentScan.imageData,
      patterns: currentScan.patterns,
      signaturePoints: currentScan.signaturePoints
    };
    
    saveRetinaData(dataToSave);
    setLastScanDate(new Date());
    
    toast({
      title: "Retina Data Saved",
      description: "Your unique retina pattern has been stored securely."
    });
  };
  const handleReset = () => {
    setIsScanning(false);
    setShowResult(false);
    setCurrentScan(null);
    setMatchResult(null);
  };
  const handleDeleteData = () => {
    setLastScanDate(undefined);
    
    toast({
      title: "Retina Data Deleted",
      description: "Your stored retina pattern has been removed."
    });
  };
  const isNewScan = !hasStoredRetinaData();

  return (
    <div className="min-h-screen bg-retina-dark text-foreground">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-retina-blue mb-2">Spectra AI</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Advanced biometric authentication using retina pattern recognition
          </p>
        </div>
        
        {}
        <RetinaDashboard 
          onDeleteData={handleDeleteData} 
          lastScanDate={lastScanDate} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {}
          <div>
            {!isScanning ? (
              <RetinaScan 
                onCapture={handleCapture} 
                isProcessing={isProcessing}
              />
            ) : showResult ? (
              <ScanResult 
                success={matchResult?.success || false} 
                matchScore={matchResult?.score}
                isNewScan={isNewScan}
                onSave={isNewScan ? handleSaveData : undefined}
                onReset={handleReset}
              />
            ) : (
              <div className="retina-card p-6 flex items-center justify-center min-h-[300px]">
                <div className="animate-pulse text-retina-blue flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-retina-blue animate-spin mb-4"></div>
                  <p>Processing scan...</p>
                </div>
              </div>
            )}
          </div>
          
          {}
          <div>
            {currentScan && (
              <RetinaAnalysis 
                patterns={currentScan.patterns}
                signaturePoints={currentScan.signaturePoints}
                matchScore={matchResult?.score}
                isMatching={!isNewScan}
              />
            )}
            
            {!currentScan && (
              <div className="retina-card p-6 flex items-center justify-center min-h-[300px]">
                <div className="text-center text-muted-foreground">
                  <p className="mb-2">No scan data available</p>
                  <p className="text-sm">Complete a retina scan to see analysis</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Spectra AI by DarkWave - Aritra Kundu · Secure Biometric Authentication · v2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
