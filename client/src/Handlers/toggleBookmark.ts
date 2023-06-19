export const toggleBookmark = async (
    isBookMarked: boolean,
    ArticleLink: string,
    currentUser: any,
    ) => {
    const email = currentUser.email;
    if (!isBookMarked) {
        await fetch(`http://127.0.0.1:5000/addBookmark?email=${email}&link=${ArticleLink}`);
        console.log("SUCCESSFULLY ADDED");
    } else {
        await fetch(`http://127.0.0.1:5000/deleteBookmark?email=${email}&link=${ArticleLink}`);
        console.log("DELETED SUCCESSFULLY");
    }
};
