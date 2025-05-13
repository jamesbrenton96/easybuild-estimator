
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Image, File } from "lucide-react";

const getFileIcon = (file: File) => {
  if (file.type === "application/pdf") {
    return <FileText className="h-4 w-4 text-red-500" />;
  }
  if (file.type === "image/jpeg" || file.type === "image/png") {
    return <Image className="h-4 w-4 text-construction-orange" />;
  }
  return <File className="h-4 w-4 text-blue-500" />;
};

export const FilesCard: React.FC<{ files: File[] }> = ({ files }) => (
  <Card className="mb-8 bg-white/5 border-white/20">
    <CardContent className="p-4">
      <h3 className="text-white font-medium mb-2">Attached Files ({files.length})</h3>
      <ScrollArea className="h-[150px] rounded-md border border-white/20 bg-white/10 p-3">
        <ul className="space-y-2">
          {files.map((file: File, idx: number) => (
            <li
              key={idx}
              className="flex items-center justify-between py-1 px-2 rounded-md bg-white/5"
            >
              <div className="flex items-center space-x-2 overflow-hidden">
                {getFileIcon(file)}
                <span className="text-white text-sm truncate">{file.name}</span>
              </div>
              <span className="text-white/60 text-xs">
                {Math.round(file.size / 1024)} KB
              </span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </CardContent>
  </Card>
);
