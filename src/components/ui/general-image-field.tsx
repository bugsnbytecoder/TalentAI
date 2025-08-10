'use client';

import React, { useRef } from 'react';

import { default as NextImage } from 'next/image';

import { UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';

import GeneralButton from './general-button';

interface GeneralImageFieldProps {
  label?: string;
  helperText?: string;
  previewUrl?: string;
  onFileSelect: (file: File) => void;
  name?: string;
}

const GeneralImageField: React.FC<GeneralImageFieldProps> = ({
  label = 'Image',
  helperText,
  previewUrl,
  onFileSelect,
  name,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (
    file: File
  ): Promise<{ file: File; preview: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 1024;
          let { width, height } = img;
          if (width > height && width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          } else if (height > width && height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('Failed to get canvas context');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            blob => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve({
                  file: compressedFile,
                  preview: URL.createObjectURL(blob),
                });
              } else {
                reject('Compression failed.');
              }
            },
            file.type,
            0.7
          );
        };
        img.onerror = () => reject('Image load error');
      };
      reader.onerror = () => reject('File read error');
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        const { file: compressedFile } = await compressImage(file);
        if (compressedFile.size > 2_000_000) {
          toast.error(
            `Image size is ${compressedFile.size / 1_000_000}MB. Only images less than 2MB are allowed.`
          );
          return;
        }
        onFileSelect(compressedFile);
      } catch (error) {
        console.error('Image compression error:', error);
      }
    }
  };

  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(' ');
    if (names.length === 0) return '👤';
    if (names.length === 1) return names[0][0]?.toUpperCase() || '👤';
    return (names[0][0] + names[1][0])?.toUpperCase();
  };

  return (
    <div className="mb-6 w-full space-y-2">
      <Label className="text-foreground text-sm font-medium">{label}</Label>
      {helperText && (
        <p className="text-muted-foreground text-xs">{helperText}</p>
      )}

      <div className="flex items-center space-x-4">
        <Avatar className="hover:ring-ring border transition-all hover:ring-2 hover:ring-offset-2">
          <AvatarFallback className="font-semibold">
            {previewUrl ? (
              <NextImage
                src={previewUrl}
                alt="Profile"
                width={50}
                height={50}
              />
            ) : (
              getInitials(name || '')
            )}
          </AvatarFallback>
        </Avatar>
        <div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <GeneralButton
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full cursor-pointer items-center gap-2"
            icon={<UploadCloud className="h-4 w-4" />}
            text="Change Image"
            type="button"
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralImageField;
