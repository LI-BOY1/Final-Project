const mongoCollections = require("../config/mongoCollections");
let { ObjectId } = require('mongodb');
const { update } = require("./trainers");
const trainers = mongoCollections.trainers;
const members = mongoCollections.members;
const courses = mongoCollections.courses;
const comments = mongoCollections.comments;

let exportedMethods ={
    async addCourse(coursename, courseInfo, img, price, start_time, day, trainerId){
        if(coursename == null || courseInfo == null || img== null || price == null || start_time == null || day == null || trainerId == null)
            throw new Error("all fields should be provided!");
        if(typeof coursename !== 'string')
            throw new Error("the input coursename is not a string!");
        if(coursename.trim().length === 0)
            throw new Error("the input coursename is not a valid string!");
        if(typeof courseInfo !== 'string')
            throw new Error("the input courseInfo is not a string!");
        if(courseInfo.trim().length === 0)
            throw new Error("the input courseInfo is not a valid string!");
        if(typeof img !== 'string')
            throw new Error("the input img is not a string!");
        if(img.trim().length === 0)
            throw new Error("the input img is not a valid string!");
        if(typeof price !== 'number')
            throw new Error("the input price is not a number!");
        if(price < 0)
            throw new Error("the price should greater than zero!");
        if(typeof start_time !== 'number')
            throw new Error("the input start_time is not a number!");
        if(start_time < 0 || start_time >= 24)
            throw new Error("the input start time must be in the range of [0, 24)");
        if(typeof start_time !== 'number')
            throw new Error("the input start_time is not a number!");
        if(typeof day !== 'number')
            throw new Error("the input day is not a number!");
        if(day <= 0 || day >= 6)
            throw new Error("the day should be in the range of [0, 5]");
        if(typeof trainerId !== 'string')
            throw new Error("the input coursename is not a string!");

        let x = ObjectId(trainerId);

        let newCourse = {
            coursename: coursename.trim(),
            courseInfo: courseInfo.trim(),
            img:img.trim(),
            price: price,
            start_time: start_time,
            day: day,
            trainerId: trainerId,
            memberId: ""
        };
        const courseCollection = await courses();
        const insertInfo = await courseCollection.insertOne(newCourse);
        if(insertInfo.insertedCount === 0)
            throw new Error('error! could not add book!');
        const newCourseId = insertInfo.insertedId.toString();
        

        const createCourse = await this.getCourseById(newCourseId);
        return createCourse;
    },
    async getAllCourses(){
        const courseCollection = await courses();
        const courseList = await courseCollection.find({}).toArray();
        if(courseList.length === 0)
            throw new Error("no courses in system!");
        for(let i = 0; i < courseList.length; i ++){
            courseList[i]._id = courseList[i]._id.toString();
        }
        return courseList;
    },
    async getCourseById(id){
        if(id == null) 
            throw new Error("you must provide an id to search for!");
        if(typeof id !== 'string') 
            throw new Error("the input value is not a string.");
        if(id.trim().length === 0) 
            throw new Error("the input string is not a valid string!");

        let parsedId = ObjectId(id);

        const courseCollection = await courses();
        const course = await courseCollection.findOne({ _id: parsedId });
        if (!course) 
            throw new Error('No Course with that id!');
        course._id = course._id.toString();
        return course;
    },
    async update(courseId, updateCourse){
        if(courseId == null || updateCourse == null)
            throw new Error("you must provide all fields!");
        if(typeof courseId !== 'string')
            throw new Error("the input courseId is not a string!");
        if(courseId.trim().length === 0)
            throw new Error("the input id is not a valid string!");
        if(typeof updateCourse !== 'object' || Array.isArray(updateCourse))
        throw new Error("the input updateCourse is not a basic object!");

        let x = ObjectId(courseId);
        await this.getCourseById(courseId);

        let updateCourseInfo = {};
        if(updateCourse.coursename)
            updateCourseInfo.coursename = updateCourse.coursename;
        if(updateCourse.courseInfo)
            updateCourseInfo.courseInfo = updateCourse.courseInfo;
        if(updateCourse.start_time)
            updateCourseInfo.start_time = updateCourse.start_time;
        if(updateCourse.day )
            updateCourseInfo.day  = updateCourse.day;
        if(updateCourse.trainerId)
            updateCourseInfo.trainerId = updateCourse.trainerId;
        
        const courseCollection = await courses();
        const updateInfo = await courseCollection.updateOne(
            {_id: x},
            {$set: updateCourseInfo}
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) 
            throw new Error('Course update failed');
        let res = await this.getCourseById(id);
        return res; 
    },
    async addMemberToCourse(courseId, memberId){
        if(memberId == null || courseId == null)
            throw new Error("you should provide both memberId and courseId to search for!")
        if(typeof memberId !== 'string' || typeof courseId !== 'string')
            throw new Error("the input id is not a string!");
        
        let leftId = ObjectId(courseId);
        let rightId = ObjectId(memberId);
        

        let curCourse = await this.getCourseById(courseId);
        if(curCourse == null)
            throw new Error("no memberId with that id!");
        //verify if the member is exist
        const memberCollection = await courses();
        await memberCollection.findOne({_id: rightId});

        const courseCollection = await courses();
        const updateInfo = await courseCollection.updateOne(
            {_id: leftId},
            {$set: {memberId : memberId}}
        );
        
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw new Error('Add member to course failed!');
        return await this.getCourseById(courseId);
    },
    async removeCourse(id){
        if(id == null)
            throw new Error("You must provide an id to search for!")
        if(typeof id !== 'string')
            throw new Error("the input id is not a string!");
        if(id.trim().length === 0)
            throw new Error("the input value is not a valid string!");

        let x = ObjectId(id);
        
        const courseCollection = await courses();

        await this.getCourseById(id);

        const deleteInfo = await courseCollection.removeOne({_id: x});
        if(deleteInfo.deleteCount === 0)
            throw new Error(`Could not delete course with id of ${id}`);
        
        return true;
    }
    
};
module.exports = exportedMethods;