'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

interface EditArticleDialogProps {
  article: {
    _id: Id<'articles'>;
    title: string;
    author?: string;
    description?: string;
    aiSummary?: string;
    tags?: string[];
    images?: string[];
  };
}

export function EditArticleDialog({ article }: EditArticleDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: article.title,
    author: article.author || '',
    description: article.description || '',
    aiSummary: article.aiSummary || '',
    tags: article.tags?.join(', ') || '',
  });
  const [currentImages, setCurrentImages] = useState<string[]>(
    article.images || []
  );

  const updateArticle = useMutation(api.articles.updateArticle);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await updateArticle({
        id: article._id,
        title: formData.title,
        author: formData.author || undefined,
        description: formData.description || undefined,
        aiSummary: formData.aiSummary || undefined,
        tags: tagsArray,
        images: currentImages,
      });

      toast.success('Article updated successfully');
      setOpen(false);
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      console.error('Failed to update article:', error);
      toast.error('Failed to update article');
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const removeImage = (imageUrl: string) => {
    setCurrentImages((prev) => prev.filter((url) => url !== imageUrl));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="neutral" size="sm">
          <Edit className="size-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Article</DialogTitle>
          <DialogDescription>
            Update the article information. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              placeholder="Article title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              placeholder="Article author"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of the article"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aiSummary">AI Summary</Label>
            <Textarea
              id="aiSummary"
              value={formData.aiSummary}
              onChange={(e) => handleInputChange('aiSummary', e.target.value)}
              placeholder="AI-generated summary of the article"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="Comma-separated tags (e.g. technology, ai, programming)"
            />
            <p className="text-sm text-foreground/60">
              Separate tags with commas
            </p>
          </div>

          {/* Images Management */}
          {currentImages.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="size-4" />
                <Label>Current Images ({currentImages.length})</Label>
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                {currentImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative group border-2 border-border rounded-lg overflow-hidden"
                  >
                    <img
                      src={imageUrl}
                      alt={`Article image ${index + 1}`}
                      className="aspect-video object-cover w-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(imageUrl)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-sm text-foreground/60">
                Click the X button to remove images you no longer want.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="neutral"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Article'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
