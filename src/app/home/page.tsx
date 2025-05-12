'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function HomePage() {
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [topArtists, setTopArtists] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = 'https://mixer-io.vercel.app';

  useEffect(() => {
    const idFromParams = searchParams.get('user_id');
    if (idFromParams) {
      setUserId(idFromParams);
      fetchAccessToken(idFromParams);
    } else {
      setError('No user ID found. Please login again.');
    }
  }, [searchParams]);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
    }
  }, [accessToken]);

  const fetchAccessToken = async (userId: string) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/get_access_token`, {
        user_id: userId,
      });
      setAccessToken(response.data.access_token);
    } catch (error) {
      console.error('Error fetching access token:', error);
      setError('Failed to retrieve access token. Please login again.');
    }
  };

  const handleGetTopTracks = async () => {
    if (!userId) {
      setError('User ID not found. Please login again.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.get(`${BACKEND_URL}/get_user_top_tracks`, {
        params: { user_id: userId },
      });

      setPrompt(data.prompt);
      setTopArtists(data.artists);
      await fetchImage(data.prompt);
    } catch (error) {
      console.error('Error fetching top tracks:', error);
      setError('Failed to fetch your top artists. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchImage = async (prompt: string, params = {}) => {
    const defaultParams = {
      model:"flux",
      format: 'png',
      nologo: true,
      private: true,
    };

    const queryParams = new URLSearchParams(
      Object.entries({ ...defaultParams, ...params }).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    );

    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?${queryParams.toString()}`;

    try {
      setIsImageLoading(true);
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsImageLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Spotify to Image Prompt Generator</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-xl w-full">
          <p>{error}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => setError(null)}>
            Dismiss
          </Button>
        </div>
      )}

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Your Spotify Top Artists</CardTitle>
        </CardHeader>

        <CardContent>
          <Button
            onClick={handleGetTopTracks}
            className="mb-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              'Get Top Artists'
            )}
          </Button>

          {topArtists.length > 0 ? (
            <ul className="space-y-2 list-disc pl-5 text-sm">
              {topArtists.map((artist, index) => (
                <li key={index}>{artist}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No top artists found yet.</p>
          )}
        </CardContent>

        {prompt && (
          <CardFooter className="flex-col items-start">
            <h3 className="text-lg font-semibold mb-2">Generated Prompt</h3>
            <p className="text-sm mb-4">{prompt}</p>

            {isImageLoading ? (
              <div className="w-full h-64 bg-gray-200 animate-pulse rounded-md mb-4" />
            ) : (
              imageUrl && (
                <>
                  <Image
                    src={imageUrl}
                    alt="Generated from your music taste"
                    className="w-full h-auto rounded-md shadow-md mb-4"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = imageUrl;
                      link.download = 'spotify-image.png';
                      link.click();
                    }}
                  >
                    Download Image
                  </Button>
                </>
              )
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
