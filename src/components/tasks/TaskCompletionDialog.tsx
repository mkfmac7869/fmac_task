import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, File, FileText, Image, Trash2, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FirebaseService } from '@/lib/firebaseService';

interface CompletionEvidence {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface TaskCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (evidence: string, attachments: CompletionEvidence[]) => void;
  taskTitle: string;
  taskId: string;
}

const TaskCompletionDialog: React.FC<TaskCompletionDialogProps> = ({
  isOpen,
  onClose,
  onComplete,
  taskTitle,
  taskId
}) => {
  const [evidence, setEvidence] = useState('');
  const [attachments, setAttachments] = useState<CompletionEvidence[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!evidence.trim()) {
      toast({
        title: "Evidence Required",
        description: "Please provide evidence that the task is completed.",
        variant: "destructive"
      });
      return;
    }

    try {
      await onComplete(evidence, attachments);
      
      // Reset form
      setEvidence('');
      setAttachments([]);
      
      toast({
        title: "Task Completed",
        description: "The task has been marked as completed with evidence.",
      });
      
      onClose();
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Completion Failed",
        description: "Failed to complete the task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Generate unique file path
      const filePath = FirebaseService.generateFilePath(taskId, file.name);
      
      // Upload file to Firebase Storage
      const downloadURL = await FirebaseService.uploadFile(file, filePath);
      
      // Create attachment object
      const attachment: CompletionEvidence = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: downloadURL,
        uploadedBy: 'Current User', // This will be replaced with actual user
        uploadedAt: new Date().toISOString()
      };
      
      setAttachments(prev => [...prev, attachment]);
      
      toast({
        title: "File Attached",
        description: `${file.name} has been successfully uploaded.`,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload the file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Complete Task: {taskTitle}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Provide evidence that this task has been completed. This will help track progress and maintain accountability.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Evidence Text Field */}
          <div className="space-y-2">
            <Label htmlFor="evidence" className="text-sm font-medium text-gray-700">
              Evidence of Completion *
            </Label>
            <Textarea
              id="evidence"
              placeholder="Describe what was accomplished, provide details about the completion, or explain the results achieved..."
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              className="min-h-[120px] resize-none"
              required
            />
            <p className="text-xs text-gray-500">
              Explain how the task was completed, what was delivered, or what results were achieved.
            </p>
          </div>

          {/* Attachments Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                Supporting Documents (Optional)
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="*/*"
              />
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div 
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(attachment.type)}
                      <div>
                        <p className="text-sm font-medium">{attachment.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(attachment.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => window.open(attachment.url, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:text-red-600"
                        onClick={() => handleDeleteAttachment(attachment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              Complete Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCompletionDialog;
