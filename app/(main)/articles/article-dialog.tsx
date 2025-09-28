'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { createArticleMetadata, extractArticleMetadata } from './actions';
import { Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';

type Status = 'idle' | 'loading' | 'success' | 'error';
type AutoFillStatus = 'idle' | 'loading' | 'success' | 'error';

interface ArticleData {
  url: string;
  title: string;
  author: string;
  description: string;
  aiSummary: string;
  tags: string; // comma-separated string
  _aiData?: {
    body?: string;
    flashcards: Array<{ question: string; answer: string }>;
    generatedTags: Array<string>;
  };
}

interface ArticleDialogProps {
  buttonText?: string;
}

export function ArticleDialog({
  buttonText = 'Add Article',
}: ArticleDialogProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [autoFillStatus, setAutoFillStatus] = useState<AutoFillStatus>('idle');
  const [open, setOpen] = useState(false);
  const [articleData, setArticleData] = useState<ArticleData>({
    url: '',
    title: '',
    author: '',
    description: '',
    aiSummary: '',
    tags: '',
    _aiData: undefined,
  });
  const router = useRouter();

  const handleAutoFill = async () => {
    if (!articleData.url.trim()) {
      setAutoFillStatus('error');
      return;
    }

    setAutoFillStatus('loading');
    try {
      const extractedData = await extractArticleMetadata({
        url: articleData.url,
      });
      setArticleData({
        ...articleData,
        title: extractedData.title,
        author: extractedData.author,
        description: extractedData.description,
        aiSummary: extractedData.summary || '',
        tags: extractedData.tags || '', // Populate AI-generated tags
        _aiData: extractedData._aiData, // Store the complete AI data
      });
      setAutoFillStatus('success');
    } catch (error) {
      setAutoFillStatus('error');
    }
  };

  const handleArticleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    try {
      // Skip AI processing if we already have AI data from AI Fill, OR if AI Fill was never used
      const skipAiProcessing =
        !!articleData._aiData || autoFillStatus !== 'success';
      await createArticleMetadata(articleData, { skipAiProcessing });
      setStatus('success');
      setOpen(false);
      // Reset form
      setArticleData({
        url: '',
        title: '',
        author: '',
        description: '',
        aiSummary: '',
        tags: '',
        _aiData: undefined,
      });
      setAutoFillStatus('idle');
      router.push('/articles');
      router.refresh();
    } catch (error) {
      setStatus('error');
    }
  };

  const handleInputChange = (field: keyof ArticleData, value: string) => {
    setArticleData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Reset auto-fill status when user manually edits
    if (autoFillStatus === 'success') {
      setAutoFillStatus('idle');
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form className="grid gap-4" onSubmit={handleArticleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Article</DialogTitle>
            <DialogDescription>
              Add an article manually or use AI to extract information from a
              URL
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* URL Field with Auto-fill button */}
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  name="url"
                  placeholder="https://example.com/article"
                  value={articleData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="neutral"
                  size="sm"
                  onClick={handleAutoFill}
                  disabled={
                    autoFillStatus === 'loading' || !articleData.url.trim()
                  }
                >
                  {autoFillStatus === 'loading' ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Sparkles />
                  )}
                  AI Fill
                </Button>
              </div>
              {autoFillStatus === 'error' && (
                <p className="text-red-500 text-sm">
                  Failed to extract article data
                </p>
              )}
              {autoFillStatus === 'success' && (
                <p className="text-green-600 text-sm">
                  Article data extracted successfully!
                </p>
              )}
            </div>

            {/* Title Field */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Article title"
                value={articleData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            {/* Author Field */}
            <div className="grid gap-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                placeholder="Author name"
                value={articleData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
              />
            </div>

            {/* Description Field */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Article description"
                value={articleData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
              />
            </div>

            {/* Tags Field */}
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="javascript, react, tutorial (comma-separated)"
                value={articleData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
              />
              {articleData.tags && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {articleData.tags
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0)
                    .map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium bg-secondary-background text-foreground border border-border rounded-base"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* AI Summary Field */}
            <div className="grid gap-2">
              <Label htmlFor="aiSummary">AI Summary</Label>
              <Textarea
                id="aiSummary"
                name="aiSummary"
                placeholder="AI-generated summary will appear here..."
                value={articleData.aiSummary}
                onChange={(e) => handleInputChange('aiSummary', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="neutral">
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={
                status === 'loading' ||
                !articleData.url.trim() ||
                !articleData.title.trim()
              }
              type="submit"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="animate-spin" /> Saving...
                </>
              ) : (
                'Save Article'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
