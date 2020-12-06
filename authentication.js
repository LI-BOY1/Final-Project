const data = require('./data');
const commentData = data.comments;
const courseData = data.courses;

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.session.user){
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');
    }
    next();
};

module.exports.isCommentAuthor = async(req, res, next) =>{
    const { id, commentId } = req.params;
    const comment = await commentData.getCommentById(commentId);
    if(comment.memberId !== req.session.user.id){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/fitclub/trainers/${id}`);
    }
    next();
};

module.exports.isCourseTrianer = async(req, res, next) => {
    const {id, courseId} = req.params;
    const course = await courseData.getCourseById(courseId);
    if(req.session.user.id !== course.trainerActId){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/fitclub/courses/trainers/${id}/${courseId}`);
    }
    next();
};