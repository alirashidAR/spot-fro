'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spotify } from '@deemlol/next-icons';

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
    <div className="min-h-screen font-sans">
      {/* Custom font in head */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>

      <div className="flex flex-col md:flex-row h-screen">
        {/* Left Section: Visual & Branding */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 p-8">
          <div className="flex flex-col justify-center h-full max-w-lg mx-auto">
            <h2 className="text-5xl font-bold mb-6 text-white tracking-tight">
              Your Artists, <br/>Your Poster.
            </h2>
            <p className="text-lg text-white/90 mb-6 leading-relaxed">
              Create unique AI-generated artwork combining your top  Spotify artists into one stunning visual masterpiece.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-white/90">AI-generated artist fusion</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white/90">Based on your Spotify data</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                  </svg>
                </div>
                <p className="text-white/90">Unique stylized poster designs</p>
              </div>
            </div>

            {/* Preview images */}
            <div className="mt-12 flex gap-3">
              <div className="w-16 h-16 rounded-md bg-white/20 overflow-hidden flex items-center justify-center">
                <div className="w-14 h-14 rounded bg-gradient-to-br from-pink-400 to-red-600"></div>
              </div>
              <div className="w-16 h-16 rounded-md bg-white/20 overflow-hidden flex items-center justify-center">
                <div className="w-14 h-14 rounded bg-gradient-to-br from-yellow-400 to-orange-600"></div>
              </div>
              <div className="w-16 h-16 rounded-md bg-white/20 overflow-hidden flex items-center justify-center">
                <div className="w-14 h-14 rounded bg-gradient-to-br from-blue-400 to-green-600"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Login */}
        <div className="flex-1 flex items-center justify-center p-8 bg-neutral-100">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Splush</h1>
              <p className="text-gray-500">
                Create your AI-generated artist poster
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p>{error}</p>
              </div>
            )}

            <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
              <CardContent className="p-6">
                <Button
                  onClick={handleLogin}
                  className="w-full py-6 flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium text-lg rounded-xl transition-all"
                >
                  <Spotify className="w-6 h-6" />
                  <span>Connect with Spotify</span>
                </Button>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                  We will only access your top artists to create your poster
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-8 flex flex-col items-center">
              <p className="text-center text-sm text-gray-500 mb-4">
                How it works:
              </p>
              <div className="flex gap-2 w-full justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2 font-medium">1</div>
                  <p className="text-xs text-gray-500">Connect</p>
                </div>
                <div className="flex-1 flex items-center">
                  <div className="h-px w-full bg-gray-200"></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 font-medium">2</div>
                  <p className="text-xs text-gray-500">Generate</p>
                </div>
                <div className="flex-1 flex items-center">
                  <div className="h-px w-full bg-gray-200"></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 font-medium">3</div>
                  <p className="text-xs text-gray-500">Download</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}