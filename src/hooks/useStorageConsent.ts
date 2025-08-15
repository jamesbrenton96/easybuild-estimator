import { useState, useEffect, useCallback } from 'react';

export const useStorageConsent = () => {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('storageConsent');
    setHasConsent(consent === 'granted');
    setIsLoading(false);
  }, []);

  const grantConsent = useCallback(() => {
    localStorage.setItem('storageConsent', 'granted');
    setHasConsent(true);
  }, []);

  const revokeConsent = useCallback(() => {
    // Clear all stored data when consent is revoked
    const keysToRemove = [
      'formData',
      'savedFormData', 
      'formDataTimestamp',
      'projectDrafts',
      'storageConsent'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    setHasConsent(false);
  }, []);

  const safeSetItem = useCallback((key: string, value: string) => {
    if (hasConsent) {
      localStorage.setItem(key, value);
      return true;
    }
    return false;
  }, [hasConsent]);

  const safeGetItem = useCallback((key: string) => {
    if (hasConsent) {
      return localStorage.getItem(key);
    }
    return null;
  }, [hasConsent]);

  const safeRemoveItem = useCallback((key: string) => {
    if (hasConsent) {
      localStorage.removeItem(key);
      return true;
    }
    return false;
  }, [hasConsent]);

  return {
    hasConsent,
    isLoading,
    grantConsent,
    revokeConsent,
    safeSetItem,
    safeGetItem,
    safeRemoveItem
  };
};