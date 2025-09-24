'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ExternalLink,
  User,
  Calendar,
  ArrowLeft,
  BookOpen,
  FileText,
  Brain,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';

// Dummy data that matches your schema
const dummyArticle = {
  _id: '123',
  _creationTime: Date.now() - 86400000, // 1 day ago
  url: 'https://example.com/amazing-article',
  title:
    'The Future of Artificial Intelligence: Transforming Industries and Society',
  author: 'Dr. Sarah Chen',
  description:
    'A comprehensive exploration of how AI is reshaping various industries and its potential impact on society, covering everything from healthcare and education to automation and ethics.',
  aiSummary:
    'This article explores the transformative impact of artificial intelligence across multiple sectors. Key points include: AI is revolutionizing healthcare through diagnostic tools and personalized medicine, education is being enhanced with adaptive learning systems, automation is changing the job market while creating new opportunities, and ethical considerations around AI deployment are becoming increasingly important. The author emphasizes the need for responsible AI development and human-AI collaboration.',
  body: `# The Future of Artificial Intelligence: Transforming Industries and Society

Artificial Intelligence (AI) has emerged as one of the most transformative technologies of our time, fundamentally reshaping how we work, learn, and interact with the world around us. As we stand at the threshold of an AI-driven future, it's crucial to understand both the immense opportunities and significant challenges that lie ahead.

## Healthcare Revolution

In healthcare, AI is proving to be a game-changer. Machine learning algorithms can now analyze medical images with unprecedented accuracy, often surpassing human specialists in detecting early-stage cancers and other conditions. 

For example, Google's DeepMind has developed AI systems that can predict acute kidney injury up to 48 hours before it occurs, potentially saving thousands of lives. Similarly, AI-powered drug discovery platforms are accelerating the development of new medications, reducing the typical 10-15 year timeline for bringing drugs to market.

### Personalized Medicine

AI enables truly personalized treatment plans by analyzing vast amounts of patient data, including genetic information, lifestyle factors, and treatment histories. This approach moves us away from the traditional "one-size-fits-all" model toward precision medicine tailored to individual patients.

## Education Transformation

The education sector is experiencing a similar revolution. Adaptive learning platforms powered by AI can customize educational content to match each student's learning pace and style. These systems identify knowledge gaps in real-time and adjust the curriculum accordingly.

### Key Benefits in Education:
- Personalized learning paths
- Automated grading and feedback
- Predictive analytics for student success
- Enhanced accessibility for students with disabilities

## The Automation Landscape

While AI-driven automation raises concerns about job displacement, it's important to recognize that technology has historically created more jobs than it has eliminated. The key is ensuring that workers have the skills needed for the jobs of tomorrow.

### Emerging Job Categories:
- AI trainers and explainers
- Human-machine interaction designers
- AI ethics specialists
- Data scientists and analysts

## Ethical Considerations

As AI becomes more prevalent, we must address critical ethical questions:

**Bias and Fairness**: AI systems can perpetuate or amplify existing biases present in training data. Ensuring fairness requires diverse development teams and comprehensive testing across different demographic groups.

**Privacy and Security**: The vast amounts of data required for AI training raise significant privacy concerns. We need robust frameworks for data protection and user consent.

**Transparency and Explainability**: As AI systems make increasingly important decisions, we need to understand how these decisions are made. "Black box" AI is particularly problematic in high-stakes areas like healthcare and criminal justice.

## The Path Forward

The future of AI is not predetermined. It will be shaped by the choices we make today regarding research priorities, regulatory frameworks, and investment in education and training.

### Recommendations for Stakeholders:

**For Businesses:**
- Invest in employee reskilling programs
- Develop AI governance frameworks
- Prioritize ethical AI development

**For Governments:**
- Update educational curricula to include AI literacy
- Develop adaptive regulatory frameworks
- Invest in research and development

**For Individuals:**
- Embrace lifelong learning
- Develop skills that complement AI
- Stay informed about AI developments

## Conclusion

AI represents both an unprecedented opportunity and a significant responsibility. By approaching AI development and deployment thoughtfully, we can harness its power to solve humanity's greatest challenges while ensuring that the benefits are shared broadly across society.

The future is not about humans versus machines, but rather about humans and machines working together to create a better world. The choices we make in the next decade will determine whether AI becomes a force for human flourishing or a source of inequality and disruption.

As we navigate this transformative period, one thing is clear: the future belongs to those who understand how to work with AI, not to AI itself. The human elements of creativity, empathy, and ethical reasoning remain irreplaceable, even as AI handles more routine tasks.

The journey ahead is complex, but with careful planning, inclusive development, and a commitment to human values, we can ensure that AI serves as a powerful tool for positive change in our world.`,
  userId: 'user123',
  tags: [
    'artificial intelligence',
    'technology',
    'healthcare',
    'education',
    'automation',
    'ethics',
    'future',
    'machine learning',
    'innovation',
    'society',
  ],
  flashcards: [
    {
      question:
        'What are the main sectors being transformed by AI according to the article?',
      answer:
        'Healthcare, education, and various industries through automation. Healthcare is seeing AI in diagnostics and personalized medicine, education is using adaptive learning platforms, and automation is changing the job market.',
    },
    {
      question: 'What ethical considerations are important for AI development?',
      answer:
        'Bias and fairness, privacy and security, and transparency and explainability. AI systems must be tested for demographic fairness, protect user data, and provide understandable decision-making processes.',
    },
    {
      question: 'How is AI revolutionizing healthcare?',
      answer:
        'Through diagnostic tools that can detect diseases early, predictive systems that can forecast conditions like kidney injury, accelerated drug discovery, and personalized treatment plans based on individual patient data.',
    },
    {
      question: 'What new job categories are emerging due to AI?',
      answer:
        'AI trainers and explainers, human-machine interaction designers, AI ethics specialists, and data scientists and analysts. These roles focus on developing, managing, and ensuring ethical use of AI systems.',
    },
    {
      question:
        'What is the key message about the future relationship between humans and AI?',
      answer:
        'The future is about humans and machines working together, not competing. Human creativity, empathy, and ethical reasoning remain irreplaceable, while AI handles routine tasks. Success depends on learning to work with AI effectively.',
    },
  ],
};

// Colorful badge variants for tags
const tagColors = [
  'bg-red-100 text-red-800 border-red-200',
  'bg-orange-100 text-orange-800 border-orange-200',
  'bg-amber-100 text-amber-800 border-amber-200',
  'bg-yellow-100 text-yellow-800 border-yellow-200',
  'bg-lime-100 text-lime-800 border-lime-200',
  'bg-green-100 text-green-800 border-green-200',
  'bg-emerald-100 text-emerald-800 border-emerald-200',
  'bg-teal-100 text-teal-800 border-teal-200',
  'bg-cyan-100 text-cyan-800 border-cyan-200',
  'bg-sky-100 text-sky-800 border-sky-200',
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-indigo-100 text-indigo-800 border-indigo-200',
  'bg-violet-100 text-violet-800 border-violet-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
  'bg-pink-100 text-pink-800 border-pink-200',
  'bg-rose-100 text-rose-800 border-rose-200',
];

// Generate consistent color for a tag based on its content
function getTagColor(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return tagColors[Math.abs(hash) % tagColors.length];
}

interface ArticleDetailProps {
  articleId: string;
}

export function ArticleDetail({ articleId }: ArticleDetailProps) {
  const [showAllFlashcards, setShowAllFlashcards] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  // In a real app, you'd fetch the article using the articleId
  const article = dummyArticle;

  const toggleFlashcard = (index: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const visibleFlashcards = showAllFlashcards
    ? article.flashcards
    : article.flashcards.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Link href="/articles">
          <Button variant="neutral" size="sm">
            <ArrowLeft className="size-4" />
            Back to Articles
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-3xl leading-tight">
                {article.title}
              </CardTitle>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 p-2 hover:bg-secondary-background rounded-base transition-colors"
                title="Open original article"
              >
                <ExternalLink className="size-5" />
              </a>
            </div>

            {article.description && (
              <CardDescription className="text-base leading-relaxed">
                {article.description}
              </CardDescription>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-foreground/60">
            {article.author && (
              <div className="flex items-center gap-2">
                <User className="size-4" />
                <span>{article.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <span>
                {new Date(article._creationTime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>
                ~{Math.ceil(article.body.split(' ').length / 200)} min read
              </span>
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="size-4" />
                <h3 className="font-medium">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center justify-center rounded-base border-2 px-3 py-1 text-sm font-base w-fit whitespace-nowrap shrink-0 ${getTagColor(
                      tag
                    )}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Summary */}
      {article.aiSummary && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="size-5" />
              <CardTitle className="text-xl">AI Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 leading-relaxed">
              {article.aiSummary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Article Body */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="size-5" />
            <CardTitle className="text-xl">Full Article</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-foreground/80 prose-p:leading-relaxed prose-strong:text-foreground prose-ul:text-foreground/80 prose-ol:text-foreground/80 prose-li:text-foreground/80">
            {article.body.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('# ')) {
                return (
                  <h1
                    key={index}
                    className="text-3xl font-heading mt-8 mb-4 first:mt-0"
                  >
                    {paragraph.slice(2)}
                  </h1>
                );
              } else if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-heading mt-6 mb-3">
                    {paragraph.slice(3)}
                  </h2>
                );
              } else if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-heading mt-5 mb-2">
                    {paragraph.slice(4)}
                  </h3>
                );
              } else if (
                paragraph.startsWith('**') &&
                paragraph.endsWith('**')
              ) {
                return (
                  <p
                    key={index}
                    className="font-medium text-foreground mt-4 mb-2"
                  >
                    {paragraph.slice(2, -2)}
                  </p>
                );
              } else if (paragraph.trim() === '') {
                return <div key={index} className="h-2" />;
              } else {
                return (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                );
              }
            })}
          </div>
        </CardContent>
      </Card>

      {/* Flashcards */}
      {article.flashcards && article.flashcards.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="size-5" />
                <CardTitle className="text-xl">
                  Flashcards ({article.flashcards.length})
                </CardTitle>
              </div>
              {article.flashcards.length > 3 && (
                <Button
                  variant="neutral"
                  size="sm"
                  onClick={() => setShowAllFlashcards(!showAllFlashcards)}
                >
                  {showAllFlashcards ? (
                    <>
                      <ChevronUp className="size-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="size-4" />
                      Show All ({article.flashcards.length})
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visibleFlashcards.map((flashcard, index) => (
                <Card
                  key={index}
                  className="cursor-pointer transition-all hover:shadow-lg"
                  onClick={() => toggleFlashcard(index)}
                >
                  <CardContent className="p-4">
                    <div className="min-h-[120px] flex items-center justify-center text-center">
                      {flippedCards.has(index) ? (
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-foreground/60 uppercase tracking-wide">
                            Answer
                          </div>
                          <p className="text-sm leading-relaxed">
                            {flashcard.answer}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-foreground/60 uppercase tracking-wide">
                            Question
                          </div>
                          <p className="text-sm leading-relaxed">
                            {flashcard.question}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 pb-4 px-4">
                    <div className="w-full text-center">
                      <span className="text-xs text-foreground/50">
                        Click to{' '}
                        {flippedCards.has(index)
                          ? 'show question'
                          : 'reveal answer'}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
