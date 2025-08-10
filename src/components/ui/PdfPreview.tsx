'use client';

import React, { useEffect, useState } from 'react';

import { Download, ExternalLink, FileText, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PdfPreviewProps {
  fileUrl: string;
  height?: string;
  title?: string;
  onError?: (error: Error) => void;
  onDownload?: () => void;
}

const isMobileDevice = () => {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(
    navigator.userAgent
  );
};

const PdfPreview: React.FC<PdfPreviewProps> = ({
  fileUrl,
  title = 'PDF Preview',
  onError,
  onDownload,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const handleLoad = () => setLoading(false);

  const handleError = () => {
    const errorMessage = 'Failed to load PDF';
    setError(errorMessage);
    onError?.(new Error(errorMessage));
    setLoading(false);
  };

  if (error) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardContent className="p-6 text-center">
          <FileText className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h3 className="mb-2 text-lg font-semibold">Failed to load PDF</h3>
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

  if (isMobile) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardContent className="p-6 text-center">
          <FileText className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h3 className="mb-2 text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground mb-4">
            PDF preview is not supported on mobile devices. You can open it in
            your browser.
          </p>
          <Button asChild>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in Browser
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative h-[60vh] w-full">
      {loading && (
        <div className="bg-opacity-75 absolute inset-0 z-10 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Loading PDF...</p>
          </div>
        </div>
      )}

      <iframe
        src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
        title={title}
        className="h-full w-full rounded-lg border shadow-sm"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          minHeight: '400px',
          maxHeight: '100%',
        }}
        allowFullScreen
      />
    </div>
  );
};

export default PdfPreview;
