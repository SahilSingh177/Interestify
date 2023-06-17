export const likeArticle = async (
    isBookMarked: boolean,
    ArticleLink: string
) => {
    if (!isBookMarked) {
        await fetch(`http://127.0.0.1:5000/addBookmark?email=test@mail&link=${ArticleLink}`);
        console.log("SUCCESSFULLY ADDED");
        return true;
    } else {
        await fetch(`http://127.0.0.1:5000/deleteBookmark?email=test@mail&link=${ArticleLink}`);
        console.log("DELETED SUCCESSFULLY");
        return false;
    }
};
