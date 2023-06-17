import { auth } from '@/firebase/clientApp'

export const bookmarkArticle = async (
    isBookMarked: boolean,
    ArticleLink: string
) => {
    const email = auth.currentUser?.email;
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
