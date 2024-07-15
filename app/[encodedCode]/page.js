'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Home from '../../components/Home'; // Adjust this import based on where your Home component is located

export default function EncodedSketchPage() {
  const searchParams = useSearchParams();
  const [decodedSketch, setDecodedSketch] = useState(null);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      try {
        // Add padding '=' signs if they're missing
        const paddedCode = code.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - code.length % 4) % 4);
        const decoded = decodeURIComponent(atob(paddedCode));
        setDecodedSketch(decoded);
      } catch (error) {
        console.error('Error decoding sketch:', error);
        // Optionally, redirect to home page or show an error
      }
    }
  }, [searchParams]);

  if (!decodedSketch) {
    return <Home />;  // Or any loading indicator, or just the default Home view
  }

  return <Home initialSketch={decodedSketch} />;
}