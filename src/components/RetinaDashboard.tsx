
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ShieldCheck, Shield, Trash2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { clearRetinaData, hasStoredRetinaData } from '../utils/retinaStorage';

interface RetinaDashboardProps {
  onDeleteData: () => void;
  lastScanDate?: Date;
}

const RetinaDashboard: React.FC<RetinaDashboardProps> = ({ onDeleteData, lastScanDate }) => {
  const [hasData, setHasData] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    setHasData(hasStoredRetinaData());
  }, [lastScanDate]);
  
  const handleDelete = () => {
    clearRetinaData();
    onDeleteData();
    setIsOpen(false);
  };
  
  // Format the date nicely
  const formattedDate = lastScanDate 
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(lastScanDate)
    : null;
  
  return (
    <Card className="retina-card mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Spectra AI by DarkWave</h2>
              <p className="text-sm text-muted-foreground">AI Powered Biometric Authentication System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasData ? (
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 text-green-400 mr-1.5" />
                <span className="text-sm text-green-400">Protected</span>
              </div>
            ) : (
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-1.5" />
                <span className="text-sm text-yellow-400">No Data</span>
              </div>
            )}
          </div>
        </div>
        
        {hasData && (
          <div className="mt-4 border-t border-border pt-4">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <div>
                <span className="text-xs text-muted-foreground block">Last scan saved</span>
                <span className="text-sm">{formattedDate}</span>
              </div>
              
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Data
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Retina Data</DialogTitle>
                    <DialogDescription>
                      This will permanently delete your stored retina scan data. You will need to create a new scan to use verification features again.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RetinaDashboard;
