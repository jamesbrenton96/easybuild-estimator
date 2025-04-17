
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Mail, Facebook, Twitter, Linkedin, Share2, Check, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ShareEstimateProps {
  isOpen: boolean;
  onClose: () => void;
  estimateContent?: string;
}

export default function ShareEstimate({ isOpen, onClose, estimateContent }: ShareEstimateProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;

  // Generate email share link with content
  const getEmailShareLink = () => {
    // Extract the first line as the subject (project name)
    const lines = estimateContent?.split('\n') || [];
    let subject = "Construction Estimate";
    
    // Find the project name if it exists
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# Project Name')) {
        if (i + 1 < lines.length && lines[i + 1].trim()) {
          subject = lines[i + 1].trim();
          break;
        }
      }
    }
    
    // Prepare email body with shortened content
    const bodyText = "Please find the attached construction estimate details:\n\n" + 
      (estimateContent?.substring(0, 1500) || "") + 
      (estimateContent && estimateContent.length > 1500 ? "...\n\n(Full estimate available on request)" : "");
    
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  };

  // Social media sharing links
  const getFacebookShareLink = () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const getTwitterShareLink = () => `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("Check out this construction estimate")}`;
  const getLinkedInShareLink = () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const openShareLink = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" /> Share Estimate
          </DialogTitle>
          <DialogDescription>
            Share this estimate via email or social media
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 my-4">
          <Input
            className="flex-1"
            value={shareUrl}
            readOnly
          />
          <Button 
            variant="outline" 
            size="icon" 
            className={copied ? "text-green-500" : ""}
            onClick={handleCopyLink}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mb-4">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-20"
            onClick={() => window.location.href = getEmailShareLink()}
          >
            <Mail className="h-6 w-6 mb-1 text-blue-600" />
            <span className="text-xs">Email</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-20"
            onClick={() => openShareLink(getFacebookShareLink())}
          >
            <Facebook className="h-6 w-6 mb-1 text-blue-600" />
            <span className="text-xs">Facebook</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-20"
            onClick={() => openShareLink(getTwitterShareLink())}
          >
            <Twitter className="h-6 w-6 mb-1 text-blue-400" />
            <span className="text-xs">Twitter</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-20"
            onClick={() => openShareLink(getLinkedInShareLink())}
          >
            <Linkedin className="h-6 w-6 mb-1 text-blue-700" />
            <span className="text-xs">LinkedIn</span>
          </Button>
        </div>
        
        <DialogFooter className="sm:justify-center gap-2">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button 
            className="bg-construction-orange hover:bg-construction-orange/90"
            onClick={handleCopyLink}
          >
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
