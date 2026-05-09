'use client';

import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { googleAuth } from '@/features/users/api/users';

export default function GoogleSignIn() {
  const { setUser } = useAuth();
  const router = useRouter();

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) return;
    try {
      const user = await googleAuth(response.credential);
      setUser(user);
      router.push('/wardrobe/items');
    } catch (err) {
      console.error('Google auth failed:', err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.error('Google login failed')}
      theme="filled_black"
      shape="pill"
      text="signin_with"
      locale="es"
    />
  );
}
