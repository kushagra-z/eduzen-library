
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/EmptyState';

// Mock data - In a real app, this would be fetched from Supabase
const MOCK_VIDEOS = {
  'eng-video-1': {
    title: 'Poetry Explanation',
    description: 'Detailed explanation of all poems',
    youtubeId: 'dQw4w9WgXcQ', // Example YouTube ID
    subject: 'english'
  },
  'math-video-1': {
    title: 'Quadratic Equations Tutorial',
    description: 'Step-by-step tutorial on solving quadratic equations',
    youtubeId: 'WHWfr_xUl9U', // Example YouTube ID
    subject: 'mathematics'
  },
  'sci-video-1': {
    title: 'Chemical Reactions',
    description: 'Visual explanations of different types of chemical reactions',
    youtubeId: '5BIk3fGHjd8', // Example YouTube ID
    subject: 'science'
  },
  'sst-video-1': {
    title: 'Nationalism in India',
    description: 'Video lecture on nationalist movements',
    youtubeId: 'WzTSE6kcLwY', // Example YouTube ID
    subject: 'social-studies'
  },
};

const VideoPage = () => {
  const { subjectId, videoId } = useParams<{ subjectId: string; videoId: string }>();
  const [video, setVideo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching video from backend
    setTimeout(() => {
      if (videoId && MOCK_VIDEOS[videoId as keyof typeof MOCK_VIDEOS]) {
        setVideo(MOCK_VIDEOS[videoId as keyof typeof MOCK_VIDEOS]);
      }
      setLoading(false);
    }, 800);
  }, [videoId]);

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center h-[70vh]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2">Loading video...</span>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container py-12">
        <EmptyState 
          title="Video Not Found"
          description="Sorry, we couldn't find the video you're looking for."
          action={{
            label: "Go Back",
            href: `/subjects/${subjectId}`
          }}
        />
      </div>
    );
  }

  const youtubeUrl = `https://www.youtube.com/embed/${video.youtubeId}`;
  const directYoutubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;

  return (
    <div className="container py-6 animate-fade-in">
      <Button variant="ghost" asChild className="mb-4">
        <Link to={`/subjects/${subjectId}`} className="flex items-center">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to {subjectId}
        </Link>
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        <p className="text-muted-foreground">{video.description}</p>
      </div>

      <Card className="overflow-hidden rounded-lg shadow-lg mb-6">
        <div className="aspect-video">
          <iframe
            className="w-full h-full"
            src={youtubeUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </Card>

      <div className="flex justify-center">
        <Button variant="outline" asChild>
          <a href={directYoutubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in YouTube
          </a>
        </Button>
      </div>
    </div>
  );
};

export default VideoPage;
