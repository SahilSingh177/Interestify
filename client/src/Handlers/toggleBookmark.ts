export const toggleBookmark = async (
    isBookMarked: boolean,
    ArticleId: string,
    currentUser: any,
    ) => {
    const email = currentUser.email;
    if (!isBookMarked) {
        await fetch(`http://nikhilranjan.pythonanywhere.com/addBookmark?email=${email}&id=${ArticleId}`);
    } else {
        await fetch(`http://nikhilranjan.pythonanywhere.com/deleteBookmark?email=${email}&id=${ArticleId}`);
    }
};
