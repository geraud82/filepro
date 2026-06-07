import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CompressVideo() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/compress');
  }, [router]);
  return null;
}
