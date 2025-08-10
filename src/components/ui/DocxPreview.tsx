'use client';

import React, { useEffect, useRef, useState } from 'react';

import { renderAsync } from 'docx-preview';
import { Download, FileText, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DocxPreviewProps {
  fileUrl: string;
  onError?: (error: Error) => void;
  onDownload?: () => void;
}

const DocxPreview: React.FC<DocxPreviewProps> = ({
  fileUrl,
  onError,
  onDownload,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocx = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();

        if (!containerRef.current) {
          throw new Error('Container not found');
        }

        // Clear previous content
        containerRef.current.innerHTML = '';

        // Render the DOCX document using the correct API
        await renderAsync(
          arrayBuffer,
          containerRef.current,
          containerRef.current,
          {
            className: 'docx',
            inWrapper: true,
            ignoreWidth: false,
            ignoreHeight: false,
            ignoreFonts: false,
            breakPages: true,
            ignoreLastRenderedPageBreak: true,
            experimental: false,
            trimXmlDeclaration: true,
            useBase64URL: true,
            renderHeaders: true,
            renderFooters: true,
            renderFootnotes: true,
            renderEndnotes: true,
            renderComments: false,
            renderAltChunks: true,
            debug: true, // Enable debug for troubleshooting
          }
        );

        setLoading(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load document';
        setError(errorMessage);
        onError?.(new Error(errorMessage));
        setLoading(false);
      }
    };

    loadDocx();
  }, [fileUrl, onError]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardContent className="p-6 text-center">
          <FileText className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h3 className="mb-2 text-lg font-semibold">
            Failed to load document
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
    <div className="h-[60vh] overflow-auto rounded-lg border bg-white">
      <div ref={containerRef} className="docx-preview-container" />
    </div>
  );
};

export default DocxPreview;
