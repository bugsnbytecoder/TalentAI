'use client';

import React, { useState } from 'react';

import Image from 'next/image';

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TiffPreviewProps {
  fileUrl: string;
  fileName?: string;
  onError?: (error: Error) => void;
  onDownload?: () => void;
}

const TiffPreview: React.FC<TiffPreviewProps> = ({
  fileUrl,
  fileName,
  onError,
  onDownload,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLoad = (event: any) => {
    setLoading(false);
    // Try to get total pages from the TIFF component
    if (event.target && event.target.tiff) {
      setTotalPages(event.target.tiff.numPages || 1);
    }
  };

  const handleError = (_err: any) => {
    const errorMessage = 'Failed to load TIFF image';
    setError(errorMessage);
    onError?.(new Error(errorMessage));
    setLoading(false);
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (error) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardContent className="p-6 text-center">
          <ImageIcon className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h3 className="mb-2 text-lg font-semibold">
            Failed to load TIFF image
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          {onDownload && (
            <Button onClick={onDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex h-[60vh] flex-col items-center justify-center px-2 sm:px-4">
      {loading && (
        <div className="bg-opacity-75 absolute inset-0 z-10 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Loading TIFF image...</p>
          </div>
        </div>
      )}

      <div className="relative max-h-full max-w-full">
        {/* Fallback to regular img for TIFF if react-tiff doesn't work */}
        <Image
          src={fileUrl}
          alt={fileName || 'TIFF image preview'}
          width={800}
          height={600}
          className="max-h-full max-w-full rounded-lg object-contain shadow-lg"
          onLoad={handleLoad}
          onError={handleError}
          style={{ display: loading ? 'none' : 'block' }}
        />
      </div>

      {/* Page navigation for multi-page TIFFs */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <span className="text-muted-foreground text-sm">
            Page {currentPage + 1} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* TIFF info */}
      <div className="mt-2 text-center">
        <p className="text-muted-foreground text-xs">
          TIFF Image {totalPages > 1 ? `(${totalPages} pages)` : ''}
        </p>
      </div>
    </div>
  );
};

export default TiffPreview;
