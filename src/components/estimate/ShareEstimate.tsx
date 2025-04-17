
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clipboard, Mail, Facebook, Twitter, Linkedin, Instagram, Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface ShareEstimateProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareEstimate({ isOpen, onClose }: ShareEstimateProps) {
  const [copied, setCopied] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  
  const currentUrl = window.location.href;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    toast.success("Link copied to clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  
  const handleEmailShare = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailTo) {
      toast.error("Please enter an email address");
      return;
    }
    
    const subject = encodeURIComponent("Brenton Building Estimate");
    const body = encodeURIComponent(`Check out this building estimate: ${currentUrl}`);
    window.open(`mailto:${emailTo}?subject=${subject}&body=${body}`);
    
    toast.success(`Email share initiated to ${emailTo}`);
    setEmailTo("");
  };
  
  const handleSocialShare = (platform: string) => {
    let shareUrl = "";
    const text = encodeURIComponent("Check out this building estimate");
    const url = encodeURIComponent(currentUrl);
    
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, "_blank", "width=600,height=400");
    toast.success(`Shared on ${platform}`);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Estimate</DialogTitle>
          <DialogDescription>
            Share this estimate with clients or colleagues
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Input
              readOnly
              value={currentUrl}
              className="bg-gray-50"
            />
          </div>
          <Button size="sm" onClick={handleCopyLink} className="px-3">
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Share via Email</h3>
          <form onSubmit={handleEmailShare} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter recipient's email"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Send
            </Button>
          </form>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Share on Social Media</h3>
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleSocialShare("facebook")}
              className="w-10 h-10 rounded-full"
            >
              <Facebook className="h-5 w-5 text-blue-600" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleSocialShare("twitter")}
              className="w-10 h-10 rounded-full"
            >
              <Twitter className="h-5 w-5 text-blue-400" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleSocialShare("linkedin")}
              className="w-10 h-10 rounded-full"
            >
              <Linkedin className="h-5 w-5 text-blue-700" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
