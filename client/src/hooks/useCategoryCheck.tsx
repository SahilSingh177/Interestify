import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/Providers/AuthProvider';

const useCategoryCheck = () => {
  const currentUser = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const checkCategories = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/hasSelectedCategories',{
          method:'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "email": currentUser?.email,
          }),
        });
        const data = await response.json();
        console.log(data);
        
        if (!data) {
          router.push('http://localhost:3000/welcome/categories'); 
        }
      } catch (error) {
        console.error('Error checking categories:', error);
      }
    };

    checkCategories();
  }, []);
};

export default useCategoryCheck;
