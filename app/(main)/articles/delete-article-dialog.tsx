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
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteArticleDialogProps {
  article: {
    _id: Id<'articles'>;
    title: string;
  };
}

export function DeleteArticleDialog({ article }: DeleteArticleDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const removeArticle = useMutation(api.articles.removeArticle);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await removeArticle({ id: article._id });
      toast.success('Article deleted successfully');
      setOpen(false);
      router.push('/articles');
      router.refresh();
    } catch (error) {
      setIsDeleting(false);
      console.error('Failed to delete article:', error);
      toast.error('Failed to delete article');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Trash2 className="size-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>Delete Article</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-foreground/80">
            Are you sure you want to delete{' '}
            <span className="font-medium">"{article.title}"</span>?
          </p>
          <p className="text-sm text-foreground/60 mt-2">
            This will permanently remove the article, including all its
            flashcards and associated data.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="neutral"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Article'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
