export const toggleLike = async (
    hasLiked: boolean,
    articleId: string,
    currentUser: any,
) => {
    if (!currentUser.email) return;
    try {
        if (hasLiked) {
            await fetch(`https://nikhilranjan.pythonanywhere.com/dislikeArticle?email=${currentUser.email}&blog_id=${articleId}`);
            console.log('SUCCESSFULLY UNLIKED');
        } else {
            await fetch(`https://nikhilranjan.pythonanywhere.com/likeArticle?email=${currentUser.email}&blog_id=${articleId}`);
            console.log('SUCCESSFULLY LIKED');
        }
    }
    catch (error) {
        console.error(error);
    }
};