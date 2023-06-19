import { useContext } from 'react';
import { AuthContext } from '@/Providers/AuthProvider';

export const toggleBookmark = async (
    isBookMarked: boolean,
    ArticleLink: string
    ) => {
    const currentUser = useContext(AuthContext);
    console.log(currentUser);
    const email = currentUser.email;
    if (!isBookMarked) {
        await fetch(`http://127.0.0.1:5000/addBookmark?email=${email}&link=${ArticleLink}`);
        console.log("SUCCESSFULLY ADDED");
        return true;
    } else {
        await fetch(`http://127.0.0.1:5000/deleteBookmark?email=${email}&link=${ArticleLink}`);
        console.log("DELETED SUCCESSFULLY");
        return false;
    }
};
