
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Save, AlertTriangle, RefreshCw } from 'lucide-react';

interface ScanResultProps {
  success: boolean;
  matchScore?: number;
  isNewScan: boolean;
  onSave?: () => void;
  onReset: () => void;
}

const ScanResult: React.FC<ScanResultProps> = ({ 
  success, 
  matchScore, 
  isNewScan, 
  onSave, 
  onReset 
}) => {
  return (
    <Card className="retina-card">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          {success ? (
            <div className="text-green-500 p-3 rounded-full bg-green-500/10 mb-4">
              <CheckCircle size={48} />
            </div>
          ) : (
            <div className="text-red-500 p-3 rounded-full bg-red-500/10 mb-4">
              <XCircle size={48} />
            </div>
          )}
          
          <h2 className="text-2xl font-bold mb-2">
            {isNewScan ? "Scan Complete" : (success ? "Identity Verified" : "No Match Found")}
          </h2>
          
          {!isNewScan && matchScore !== undefined && (
            <Badge variant={success ? "default" : "destructive"} className="mb-4">
              {Math.round(matchScore)}% Match
            </Badge>
          )}
          
          <p className="text-muted-foreground mb-6">
            {isNewScan 
              ? "Your retina scan has been successfully analyzed. Save this scan for future verification."
              : (success 
                ? "The current scan matches your previously stored retina pattern."
                : "The current scan does not match the stored retina pattern.")}
          </p>
          
          <div className="flex gap-3">
            {isNewScan && onSave && (
              <Button onClick={onSave} className="bg-retina-blue hover:bg-retina-accent">
                <Save className="mr-2 h-4 w-4" />
                Save Retina Data
              </Button>
            )}
            
            <Button 
              onClick={onReset} 
              variant="outline"
              className="border-retina-blue text-retina-blue hover:bg-retina-blue/10"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              New Scan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanResult;
