
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useStorageConsent } from '@/hooks/useStorageConsent';

export interface DraftItem {
  id: string;
  name: string;
  formData: any;
  createdAt: string;
  updatedAt: string;
}

export const useDraftHistory = () => {
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { hasConsent, safeGetItem, safeSetItem } = useStorageConsent();

  // Load drafts from localStorage on mount
  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = useCallback(() => {
    if (!hasConsent) return;
    
    try {
      const storedDrafts = safeGetItem('projectDrafts');
      if (storedDrafts) {
        const parsedDrafts = JSON.parse(storedDrafts);
        setDrafts(parsedDrafts.sort((a: DraftItem, b: DraftItem) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ));
      }
    } catch (error) {
      console.error('Error loading drafts:', error);
    }
  }, [hasConsent, safeGetItem]);

  const saveDraft = useCallback((name: string, formData: any) => {
    if (!hasConsent) {
      toast.error('Storage consent required to save drafts');
      return null;
    }
    
    try {
      setIsLoading(true);
      
      // Create a copy without file objects for storage
      const draftData = { ...formData };
      if (draftData.files) {
        delete draftData.files;
      }

      const now = new Date().toISOString();
      const draftId = `draft_${Date.now()}`;
      
      const newDraft: DraftItem = {
        id: draftId,
        name: name.trim() || `Draft ${new Date().toLocaleDateString()}`,
        formData: draftData,
        createdAt: now,
        updatedAt: now,
      };

      const updatedDrafts = [newDraft, ...drafts].slice(0, 20); // Keep max 20 drafts
      setDrafts(updatedDrafts);
      safeSetItem('projectDrafts', JSON.stringify(updatedDrafts));
      
      toast.success('Draft saved successfully');
      return draftId;
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [hasConsent, drafts, safeSetItem]);

  const loadDraft = useCallback((draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      toast.success(`Loaded draft: ${draft.name}`);
      return draft.formData;
    }
    return null;
  }, [drafts]);

  const deleteDraft = useCallback((draftId: string) => {
    if (!hasConsent) return;
    
    try {
      const updatedDrafts = drafts.filter(d => d.id !== draftId);
      setDrafts(updatedDrafts);
      safeSetItem('projectDrafts', JSON.stringify(updatedDrafts));
      toast.success('Draft deleted');
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast.error('Failed to delete draft');
    }
  }, [hasConsent, drafts, safeSetItem]);

  const renameDraft = useCallback((draftId: string, newName: string) => {
    if (!hasConsent) return;
    
    try {
      const updatedDrafts = drafts.map(draft => 
        draft.id === draftId 
          ? { ...draft, name: newName.trim() || draft.name, updatedAt: new Date().toISOString() }
          : draft
      );
      setDrafts(updatedDrafts);
      safeSetItem('projectDrafts', JSON.stringify(updatedDrafts));
      toast.success('Draft renamed');
    } catch (error) {
      console.error('Error renaming draft:', error);
      toast.error('Failed to rename draft');
    }
  }, [hasConsent, drafts, safeSetItem]);

  return {
    drafts,
    saveDraft,
    loadDraft,
    deleteDraft,
    renameDraft,
    isLoading,
    refreshDrafts: loadDrafts,
  };
};
