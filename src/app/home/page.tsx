'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [topArtists, setTopArtists] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // State to hold the generated image URL

  const handleLogin = () => {
    // Redirect to the backend login route to authenticate with Spotify
    window.location.href = 'https://mixer-io.vercel.app/login';
  };

  const handleGetTopTracks = async () => {
    try {
      const { data } = await axios.get('https://mixer-io.vercel.app/get_user_top_tracks', {
        params: { access_token: accessToken },
      });
      console.log('Top Tracks:', data); // Log the response from the backend
      setPrompt(data.prompt); // Store the generated prompt
      setTopArtists(data.artists); // Store the artists array

      // Generate the image based on the prompt
      fetchImage(data.prompt); 
    } catch (error) {
      console.error('Error fetching top tracks:', error);
    }
  };

  const handleCallback = (code: string, state: string) => {
    // Get the access token from the backend after Spotify redirect
    axios
      .get(`https://mixer-io.vercel.app/callback?code=${code}&state=${state}`)
      .then((response) => {
        setAccessToken(response.data.access_token);
        console.log('Access Token:', response.data.access_token);
      })
      .catch((error) => {
        console.error('Error during callback:', error);
      });
  };

  // Check for the 'code' query parameter in the URL after redirection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code'); // Extract the code from the URL
    const state = urlParams.get('state'); // Extract the state from the URL
    console.log('Code:', code);
    console.log('State:', state);
    if (code && state) {
      handleCallback(code, state); // Handle the callback and fetch the access token
    }
  }, []);

  const fetchImage = async (prompt:string, params = {}) => {
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
        const errorText = await response.text(); // Get error details if possible
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl); // Set the image URL in state

      console.log("Image fetched and displayed.");
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Spotify to Image Prompt Generator</h1>
      {!accessToken ? (
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
            <Button onClick={handleGetTopTracks} className="mb-4">Get Top Artists</Button>
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
          <CardFooter className="flex-col items-start">
            <h3 className="text-lg font-semibold mb-2">Generated Prompt</h3>
            <p className="text-sm">{prompt || 'No prompt generated yet.'}</p>
            {/* Display the generated image */}
            {imageUrl && <img src={imageUrl} alt={prompt} className="mt-4 w-full" />}
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Home;
