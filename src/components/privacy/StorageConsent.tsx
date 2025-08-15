import React, { useState, useEffect } from 'react';
import { AlertCircle, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StorageConsentProps {
  onConsent: (granted: boolean) => void;
}

export const StorageConsent: React.FC<StorageConsentProps> = ({ onConsent }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('storageConsent');
    if (consent === null) {
      setIsVisible(true);
    } else {
      onConsent(consent === 'granted');
    }
  }, [onConsent]);

  const handleConsent = (granted: boolean) => {
    localStorage.setItem('storageConsent', granted ? 'granted' : 'denied');
    onConsent(granted);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Data Storage Consent</CardTitle>
          </div>
          <CardDescription>
            Help us improve your experience with secure local storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">What we store locally:</p>
              <ul className="space-y-1 text-xs">
                <li>• Your form data to prevent loss during sessions</li>
                <li>• Draft projects for future reference</li>
                <li>• Failed submission data for recovery</li>
              </ul>
              <p className="mt-2 text-xs">
                <strong>This data stays on your device</strong> and is never transmitted to third parties.
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => handleConsent(true)}
              className="flex-1"
            >
              Allow Storage
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleConsent(false)}
              className="flex-1"
            >
              Decline
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            You can change this preference anytime in your browser settings
          </p>
        </CardContent>
      </Card>
    </div>
  );
};