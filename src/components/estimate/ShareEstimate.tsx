
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Mail, Facebook, Twitter, Linkedin, Share2, Check, ExternalLink, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import html2pdf from "html2pdf.js";
import { useEstimator } from "@/context/EstimatorContext";

interface ShareEstimateProps {
  isOpen: boolean;
  onClose: () => void;
  estimateContent?: string;
}

export default function ShareEstimate({ isOpen, onClose, estimateContent }: ShareEstimateProps) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const { showMaterialSources } = useEstimator();

  const generatePDF = async () => {
    setIsGeneratingPdf(true);
    try {
      const element = document.querySelector('.pdf-content');
      if (!element) {
        toast.error("Could not find estimate content to convert to PDF");
        return;
      }
      
      const opt = {
        margin: [10, 15, 10, 15],
        filename: 'brenton-building-estimate.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after',
          avoid: ['table', 'img']
        }
      };
      
      // Clone the element to modify it without affecting the original
      const clone = element.cloneNode(true) as HTMLElement;
      
      // Hide material sources if toggled off
      if (!showMaterialSources) {
        const tables = clone.querySelectorAll('table');
        tables.forEach(table => {
          const headers = table.querySelectorAll('th');
          const isSourceTable = Array.from(headers).some(header => 
            header.textContent?.toLowerCase().includes('source'));
            
          if (isSourceTable) {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
              const cells = row.querySelectorAll('th, td');
              if (cells.length >= 5) {
                const cell = cells[4] as HTMLElement;
                cell.style.display = 'none';
              }
            });
          }
        });
      }
      
      // Create header with logo
      const header = document.createElement('div');
      header.style.textAlign = 'center';
      header.style.marginBottom = '5px';
      header.style.padding = '8px';
      
      const logo = document.createElement('img');
      logo.src = "/lovable-uploads/54be63ea-83fd-4f4a-8c94-dba12936b674.png";
      logo.style.height = '100px';
      logo.style.margin = '0 auto 0 auto';
      
      header.appendChild(logo);
      clone.insertBefore(header, clone.firstChild);
      
      // Generate PDF as blob
      const pdf = await html2pdf().from(clone).set(opt).outputPdf('blob');
      const blob = new Blob([pdf], { type: 'application/pdf' });
      setPdfBlob(blob);
      
      // Create URL for the blob
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      
      toast.success("PDF generated successfully! You can now share it.");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Generate email share link with PDF attachment
  const getEmailShareLink = () => {
    const subject = "Construction Estimate - Brenton Building";
    const bodyText = "Please find the attached construction estimate from Brenton Building.\n\n" + 
      "Note: Due to email limitations, you may need to download the PDF from the shared link.\n\n" +
      (pdfUrl ? `PDF Link: ${pdfUrl}\n\n` : "") +
      "For any questions, please contact Brenton Building 'UKNZ' Limited directly.";
    
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  };

  // Social media sharing with PDF mention
  const getFacebookShareLink = () => {
    const text = "Construction estimate PDF available for download";
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pdfUrl || window.location.href)}&quote=${encodeURIComponent(text)}`;
  };
  
  const getTwitterShareLink = () => {
    const text = "Construction estimate PDF from Brenton Building";
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pdfUrl || window.location.href)}`;
  };
  
  const getLinkedInShareLink = () => {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pdfUrl || window.location.href)}`;
  };

  const handleCopyLink = () => {
    const linkToCopy = pdfUrl || window.location.href;
    navigator.clipboard.writeText(linkToCopy);
    setCopied(true);
    toast.success("Link copied to clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleDownloadPdf = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'brenton-building-estimate.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded successfully!");
    }
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
            Generate and share your estimate as a PDF file
          </DialogDescription>
        </DialogHeader>
        
        {!pdfBlob ? (
          <div className="text-center py-6">
            <p className="text-sm text-gray-600 mb-4">
              First, generate a PDF version of your estimate to share
            </p>
            <Button 
              onClick={generatePDF}
              disabled={isGeneratingPdf}
              className="bg-construction-orange hover:bg-construction-orange/90"
            >
              {isGeneratingPdf ? (
                <>Generating PDF...</>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate PDF
                </>
              )}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2 my-4">
              <Input
                className="flex-1"
                value={pdfUrl}
                readOnly
                placeholder="PDF download link"
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
          </>
        )}
        
        <DialogFooter className="sm:justify-center gap-2">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          {pdfBlob && (
            <Button 
              onClick={handleDownloadPdf}
              className="bg-construction-orange hover:bg-construction-orange/90"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          )}
          {pdfBlob && (
            <Button 
              variant="outline"
              onClick={handleCopyLink}
            >
              {copied ? "Copied!" : "Copy PDF Link"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
