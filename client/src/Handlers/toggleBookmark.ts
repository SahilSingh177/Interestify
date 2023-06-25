export const toggleBookmark = async (
    isBookMarked: boolean,
    ArticleId: string,
    currentUser: any,
    ) => {
    const email = currentUser.email;
    if (!isBookMarked) {
        await fetch(`http://127.0.0.1:5000/addBookmark?email=${email}&id=${ArticleId}`);
    } else {
        await fetch(`http://127.0.0.1:5000/deleteBookmark?email=${email}&id=${ArticleId}`);
    }
};
