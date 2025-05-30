'use client';

import { useEffect, useState, Suspense } from 'react';
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
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    setClientReady(true);
  }, []);

  if (!clientReady) return null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsComponent />
    </Suspense>
  );
}

function SearchParamsComponent() {
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [topArtists, setTopArtists] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
      autoGetTopTracks();
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

  const autoGetTopTracks = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const { data } = await axios.get(`${BACKEND_URL}/get_user_top_tracks`, {
        params: { user_id: userId },
      });

      const prompt = data.prompt;
      const lastColonIndex = prompt.lastIndexOf(':');
      const formattedPrompt = lastColonIndex !== -1 ? prompt.slice(0, lastColonIndex).trim() : prompt.trim();
      setPrompt(formattedPrompt);
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
      model: 'flux',
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
      setShowImage(false);
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);

      // Delay showing image to create engagement
      setTimeout(() => {
        setShowImage(true);
      }, 1500);
    } catch (error) {
      console.error('Error fetching image:', error);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsImageLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800 tracking-tight">
        🎵 Your Spotify Sound in a Picture
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-xl w-full">
          <p>{error}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => setError(null)}>
            Dismiss
          </Button>
        </div>
      )}

      <Card className="w-full max-w-2xl shadow-xl border-none bg-white/70 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Your Spotify Top Artists</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center mb-4">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ul className="space-y-1 text-base text-gray-800 pl-4 list-disc mb-4">
              {topArtists.slice(0, 2).map((artist, index) => (
                <li key={index}>{artist}</li>
              ))}
            </ul>
          )}
        </CardContent>

        {prompt && (
          <CardFooter className="flex flex-col items-start gap-4">
            <Button variant="outline" onClick={() => setShowModal(true)}>
              Show Persona
            </Button>

            {isImageLoading ? (
              <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg" />
            ) : (
              showImage &&
              imageUrl && (
                <div className="flex flex-col items-center w-full gap-3">
                  <Image
                    width={500}
                    height={500}
                    src={imageUrl}
                    alt="Generated from your music taste"
                    className="rounded-lg shadow-lg transition-opacity duration-1000 ease-in opacity-100"
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
                </div>
              )
            )}
          </CardFooter>
        )}
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Splush Persona</h2>
            <p className="text-gray-700 text-sm whitespace-pre-line">{prompt}</p>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
