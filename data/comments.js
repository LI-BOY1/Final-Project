const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
let { ObjectId } = require('mongodb');
const trainers = require('./trainers');
const members = require('./members');


let exportedMethods ={
    async addComment(comment, trainerId, rating){
        if(comment == null || trainerId == null || rating == null)
            throw new Error("all fields should be provided!");
        // if(typeof memberId !== 'string')
        //     throw new Error("the input member id is not a string!");
        // if(typeof courseId !== 'string')
        //     throw new Error("the input course id is not a string!");
        if(typeof comment !== 'string')
            throw new Error("the input comment is not a string!");
        if(comment.trim().length === 0)
            throw new Error("the input comment is not a valid string!");
        if(typeof trainerId !== 'string')
            throw new Error("the input trainer id is not a string!");
        if(typeof rating !== 'number')
            throw new Error("the inpur rating is not a number!");
        if(rating < 0 || rating > 5)
            throw new Error("the rating should be in the range of [1,5].");
        
        // let x = ObjectId(memberId);
        // let y = ObjectId(courseId);
        let z = ObjectId(trainerId);

        let newComment = {
            // memberId: memberId,
            // courseId: courseId,
            comment: comment,
            trainerId: trainerId,
            rating: rating
        };

        const commentCollection = await comments();
        const insertInfo = await commentCollection.insertOne(newComment);
        if(insertInfo.insertedCount === 0)
            throw new Error('error! could not add comment!');
        
        const newCommentId = insertInfo.insertedId.toString();
        
        //add comment to member, for now, I think it is no need for us to add comment to member,
        //cz we do not have to find comment in member db!!!!
        // await members.addCommentToMember(memberId, newCommentId);
        //add comment to trainer
        await trainers.addCommentToTrainer(trainerId, newCommentId);

        const createComment = await this.getCommentById(newCommentId);
        return createComment;
    },
    async getAllComments(){
        const commentCollection = await comments();
        const commentList = await commentCollection.find({}).toArray();
        if(commentList.length === 0)
            throw new Error("no comment in system!");
        for(let i = 0; i < commentList.length; i ++){
            commentList[i]._id = commentList[i]._id.toString();
        }
        return commentList;
    },
    async getCommentById(id){
        if(id == null) 
            throw new Error("you must provide an id to search for!");
        if(typeof id !== 'string') 
            throw new Error("the input value is not a string.");
        if(id.trim().length === 0) 
            throw new Error("the input string is not a valid string!");

        let parsedId = ObjectId(id);

        const commentCollection = await comments();
        const comment = await commentCollection.findOne({ _id: parsedId });
        if (!comment) 
            throw new Error('No comment with that id!');
        comment._id = comment._id.toString();
        return comment;
    }
    
    
};
module.exports = exportedMethods;