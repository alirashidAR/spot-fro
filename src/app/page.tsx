'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const BACKEND_URL = 'https://mixer-io.vercel.app';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('auth_success');
    const userId = urlParams.get('user_id');
    const authError = urlParams.get('error');

    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, '/');
    }

    if (authError) {
      setError('Authentication failed. Please try again.');
    } else if (authSuccess === 'true' && userId) {
      router.push(`/home?user_id=${userId}`);
    }
  }, [router]);

  const handleLogin = () => {
    window.location.href = `${BACKEND_URL}/login`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Login to Spotify</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <Button onClick={handleLogin} className="w-full">
            Login with Spotify
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
