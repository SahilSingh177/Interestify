import { useEffect, useContext} from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/Providers/AuthProvider';

const useAuthRedirect = () => {
  const currentUser = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('http://localhost:3000/login');
    }
  }, [currentUser, router]);
};

export default useAuthRedirect;
