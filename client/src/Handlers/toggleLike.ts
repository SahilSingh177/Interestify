export const toggleLike = async (
    hasLiked: boolean,
    articleId: string,
    currentUser: any,
) => {
    if (!currentUser.email) return;
    try {
        if (hasLiked) {
            await fetch(`http://127.0.0.1:5000/dislikeArticle?email=${currentUser.email}&blog_id=${articleId}`);
            console.log('SUCCESSFULLY UNLIKED');
        } else {
            await fetch(`http://127.0.0.1:5000/likeArticle?email=${currentUser.email}&blog_id=${articleId}`);
            console.log('SUCCESSFULLY LIKED');
        }
    }
    catch (error) {
        console.error(error);
    }
};