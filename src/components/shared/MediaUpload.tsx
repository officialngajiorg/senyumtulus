"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Paperclip, UploadCloud, FileText, Image as ImageIcon } from "lucide-react";
import React, { useState, useRef } from "react";
import Image from "next/image";

interface MediaUploadProps {
  onFileChange?: (file: File | null) => void;
  idSuffix?: string; // To ensure unique IDs if multiple instances are on a page
}

export default function MediaUpload({ onFileChange, idSuffix = "" }: MediaUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (onFileChange) {
        onFileChange(file);
      }
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
      if (onFileChange) {
        onFileChange(null);
      }
    }
  };

  const uniqueId = `file-upload-${idSuffix}`;

  return (
    <div className="space-y-3 p-4 border border-dashed rounded-md hover:border-primary transition-colors">
      <Label htmlFor={uniqueId} className="flex flex-col items-center justify-center cursor-pointer w-full">
        <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
        <span className="text-sm font-medium text-primary">
          Click to upload or drag and drop
        </span>
        <span className="text-xs text-muted-foreground">
          Photos or Medical Documents (Max 5MB)
        </span>
      </Label>
      <Input
        id={uniqueId}
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,application/pdf,.doc,.docx,.txt"
      />
      
      {selectedFile && (
        <div className="mt-3 p-3 bg-secondary/50 rounded-md">
          <div className="flex items-center gap-3">
            {previewUrl ? (
              <Image src={previewUrl} alt="Preview" width={60} height={60} className="rounded object-cover" data-ai-hint="upload preview" />
            ) : (
              <FileText className="h-10 w-10 text-primary" />
            )}
            <div className="text-sm">
              <p className="font-medium text-foreground truncate max-w-xs">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                ({(selectedFile.size / 1024).toFixed(1)} KB) - {selectedFile.type}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => {
              setSelectedFile(null);
              setPreviewUrl(null);
              if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
              if (onFileChange) onFileChange(null);
            }} className="ml-auto text-destructive hover:text-destructive-foreground hover:bg-destructive/90">
              Remove
            </Button>
          </div>
        </div>
      )}
       {!selectedFile && <p className="text-xs text-muted-foreground text-center">No file chosen. Allowed: JPG, PNG, PDF, DOC.</p>}
    </div>
  );
}
