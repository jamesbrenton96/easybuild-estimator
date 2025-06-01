
import React, { useState } from 'react';
import { useDraftHistory, DraftItem } from '@/hooks/useDraftHistory';
import { useEstimator } from '@/context/EstimatorContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Save, History, Trash2, Edit2, Download, Info } from 'lucide-react';
import { toast } from 'sonner';

export const DraftManager = () => {
  const { formData, updateFormData, setStep } = useEstimator();
  const { drafts, saveDraft, loadDraft, deleteDraft, renameDraft, isLoading } = useDraftHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleSaveDraft = () => {
    if (!draftName.trim()) {
      toast.error('Please enter a draft name');
      return;
    }
    
    console.log('Saving draft with data:', formData);
    const result = saveDraft(draftName, formData);
    console.log('Save result:', result);
    setDraftName('');
  };

  const handleLoadDraft = (draftId: string) => {
    console.log('Loading draft:', draftId);
    const draftData = loadDraft(draftId);
    console.log('Loaded draft data:', draftData);
    if (draftData) {
      updateFormData(draftData);
      setStep(2); // Go to Basic Info step
      setIsOpen(false);
    }
  };

  const handleRename = (draftId: string) => {
    if (editName.trim()) {
      renameDraft(draftId, editName);
      setEditingId(null);
      setEditName('');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hasFormData = formData && Object.keys(formData).some(key => {
    const value = formData[key];
    return value && value !== '' && !(Array.isArray(value) && value.length === 0);
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          <History className="h-4 w-4 mr-2" />
          Drafts ({drafts.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-slate-900 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Project Drafts</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Info Box */}
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-100">
                  <p className="font-medium mb-1">How Drafts Work:</p>
                  <ul className="text-xs space-y-1 text-blue-200/80">
                    <li>• Drafts save your form inputs locally on this device</li>
                    <li>• Fill out project details, then save with a name</li>
                    <li>• Load saved drafts to restore your previous inputs</li>
                    <li>• Drafts persist between browser sessions</li>
                    <li>• Files are not saved in drafts (only form data)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Current Draft */}
          <Card className="bg-white/5 border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">
                Save Current Progress
                {!hasFormData && (
                  <span className="text-xs text-yellow-400 ml-2">(No form data to save)</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter draft name..."
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveDraft()}
                  disabled={!hasFormData}
                />
                <Button 
                  onClick={handleSaveDraft}
                  disabled={isLoading || !hasFormData}
                  className="bg-construction-orange hover:bg-construction-orange/90"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
              {!hasFormData && (
                <p className="text-xs text-white/60">
                  Fill out some project details first, then come back to save as a draft.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Drafts List */}
          <Card className="bg-white/5 border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">Saved Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                {drafts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white/60 mb-2">No drafts saved yet</p>
                    <p className="text-xs text-white/40">
                      Save your first draft by filling out project details above
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {drafts.map((draft: DraftItem) => (
                      <div key={draft.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            {editingId === draft.id ? (
                              <div className="flex gap-2">
                                <Input
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="bg-white/10 border-white/20 text-white text-sm h-8"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleRename(draft.id);
                                    if (e.key === 'Escape') {
                                      setEditingId(null);
                                      setEditName('');
                                    }
                                  }}
                                  autoFocus
                                />
                                <Button 
                                  size="sm" 
                                  onClick={() => handleRename(draft.id)}
                                  className="h-8 px-2"
                                >
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <>
                                <h4 className="text-white font-medium truncate">{draft.name}</h4>
                                <p className="text-white/60 text-xs">
                                  {formatDate(draft.updatedAt)}
                                </p>
                              </>
                            )}
                          </div>
                          
                          {editingId !== draft.id && (
                            <div className="flex gap-1 ml-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleLoadDraft(draft.id)}
                                className="h-8 px-2 text-white hover:bg-white/10"
                                title="Load this draft"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingId(draft.id);
                                  setEditName(draft.name);
                                }}
                                className="h-8 px-2 text-white hover:bg-white/10"
                                title="Rename draft"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteDraft(draft.id)}
                                className="h-8 px-2 text-red-400 hover:bg-red-500/10"
                                title="Delete draft"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
