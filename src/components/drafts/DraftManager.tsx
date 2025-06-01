
import React, { useState } from 'react';
import { useDraftHistory, DraftItem } from '@/hooks/useDraftHistory';
import { useEstimator } from '@/context/EstimatorContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Save, History, Trash2, Edit2, Download } from 'lucide-react';
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
    
    saveDraft(draftName, formData);
    setDraftName('');
  };

  const handleLoadDraft = (draftId: string) => {
    const draftData = loadDraft(draftId);
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
          {/* Save Current Draft */}
          <Card className="bg-white/5 border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">Save Current Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter draft name..."
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveDraft()}
                />
                <Button 
                  onClick={handleSaveDraft}
                  disabled={isLoading}
                  className="bg-construction-orange hover:bg-construction-orange/90"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
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
                  <p className="text-white/60 text-center py-8">No drafts saved yet</p>
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
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteDraft(draft.id)}
                                className="h-8 px-2 text-red-400 hover:bg-red-500/10"
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
