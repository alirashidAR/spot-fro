'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [topArtists, setTopArtists] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = 'https://mixer-io.vercel.app/'; // Update this with your actual backend URL

  const handleLogin = () => {
    // Redirect to the backend login route to authenticate with Spotify
    window.location.href = `${BACKEND_URL}/login`;
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
      console.log('API Response:', data);
      
      setPrompt(data.prompt);
      setTopArtists(data.artists);

      // Generate the image based on the prompt
      await fetchImage(data.prompt);
    } catch (error) {
      console.error('Error fetching top tracks:', error);
      setError('Failed to fetch your top artists. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check for auth_success and user_id parameters in the URL after redirection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('auth_success');
    const newUserId = urlParams.get('user_id');
    const authError = urlParams.get('error');
    
    // Clear URL parameters to avoid sharing sensitive data
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, '/home');
    }

    if (authError) {
      setError('Authentication failed. Please try again.');
      return;
    }
    
    if (authSuccess === 'true' && newUserId) {
      console.log('Authentication successful. User ID:', newUserId);
      setUserId(newUserId);
      
      // Fetch the access token using the user ID
      fetchAccessToken(newUserId);
    }
  }, []);

  const fetchAccessToken = async (userId: string) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/get_access_token`, { user_id: userId });
      setAccessToken(response.data.access_token);
      console.log('Access token retrieved successfully');
    } catch (error) {
      console.error('Error fetching access token:', error);
      setError('Failed to retrieve access token. Please login again.');
    }
  };

  const fetchImage = async (prompt: string, params = {}) => {
    const defaultParams = {
      quality: 80,
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

    console.log("Fetching image from:", url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);
      console.log("Image fetched and displayed.");
    } catch (error) {
      console.error("Error fetching image:", error);
      setError('Failed to generate image. Please try again.');
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Spotify to Image Prompt Generator</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}
      
      {!userId ? (
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <Button onClick={handleLogin} className="w-full">Login with Spotify</Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Your Spotify Top Artists</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGetTopTracks} 
              className="mb-4"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Get Top Artists'}
            </Button>
            
            {topArtists.length > 0 ? (
              <ul className="space-y-2 list-disc pl-5">
                {topArtists.map((artist, index) => (
                  <li key={index} className="text-sm">{artist}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No top artists found.</p>
            )}
          </CardContent>
          
          {prompt && (
            <CardFooter className="flex-col items-start">
              <h3 className="text-lg font-semibold mb-2">Generated Prompt</h3>
              <p className="text-sm">{prompt}</p>
              
              {imageUrl && (
                <div className="mt-4 w-full">
                  <img 
                    src={imageUrl} 
                    alt="Generated from your music taste" 
                    className="w-full rounded-md shadow-md"
                  />
                </div>
              )}
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
};

export default Home;