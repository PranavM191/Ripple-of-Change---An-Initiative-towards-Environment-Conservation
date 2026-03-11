import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, CheckCircle } from "lucide-react";
import { completeDrive } from "@/services/apiService";
import { useToast } from "@/hooks/use-toast";

interface CompleteDriveDialogProps {
  driveId: number;
  driveTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CompleteDriveDialog({ driveId, driveTitle, isOpen, onClose, onSuccess }: CompleteDriveDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [wasteCollected, setWasteCollected] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!wasteCollected || !file) {
      toast({ variant: "destructive", title: "Missing Data", description: "Please enter waste amount and upload a photo." });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("wasteCollected", wasteCollected);
      formData.append("file", file);

      await completeDrive(driveId, formData);

      toast({ title: "Drive Completed! 🎉", description: "Impact recorded and gallery updated." });
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to update drive." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            Mark Drive as Complete
          </DialogTitle>
          <DialogDescription>
            Finalize <strong>{driveTitle}</strong>. Enter the impact stats and upload proof.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label>Total Waste Collected (kg)</Label>
            <Input 
                type="number" 
                placeholder="e.g. 120.5" 
                value={wasteCollected}
                onChange={(e) => setWasteCollected(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Upload "After" Photo</Label>
            <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          Submit Impact Report
        </Button>
      </DialogContent>
    </Dialog>
  );
}