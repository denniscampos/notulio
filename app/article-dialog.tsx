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
import { createArticleMetadata } from './actions';
import { Loader2 } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function ArticleDialog() {
  const [status, setStatus] = useState<Status>('idle');
  const [articleURL, setArticleURL] = useState<string>('');

  const handleArticleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await createArticleMetadata({ url: articleURL });
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>Add Your First Article</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form className="grid gap-4" onSubmit={handleArticleSubmit}>
            <DialogHeader>
              <DialogTitle>Add Article</DialogTitle>
              <DialogDescription>Add an article to..</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <Label htmlFor="url">URL:</Label>
              <Input
                id="url"
                name="url"
                defaultValue="https://www.example.com/"
                onChange={(e) => setArticleURL(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit" variant="neutral">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={status === 'loading'} type="submit">
                {status === 'loading' ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'Save + summarize'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </form>
    </Dialog>
  );
}
