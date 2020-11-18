const mongoCollections = require("../config/mongoCollections");
let { ObjectId } = require('mongodb');

const trainers = mongoCollections.trainers;
const members = mongoCollections.members;
const courses = mongoCollections.courses;
const comments = mongoCollections.comments;


let exportedMethods ={
    async addMember(first_name, last_name, age, phone, email, address, zipcode,username, password){
        if(first_name == null || last_name == null || age == null || phone == null || email == null || address == null || zipcode == null || username == null || password == null)
            throw new Error("all fields need to have valid values!");
        if(typeof first_name !== 'string')
            throw new Error("the input first name is not a string!");
        if(first_name.trim().length === 0)
            throw new Error("the input first name is not a valid string!");
        if(typeof last_name !== 'string')
            throw new Error("the input last name is not a string!");
        if(last_name.trim().length === 0)
            throw new Error("the input last name is not a valid string!");
        if(typeof age !== 'number')
            throw new Error("the input age is not a number!");
        if(age < 18 || age > 100)
            throw new Error("the input age should be in the range of 18-100");
        if(typeof phone !== 'string')
            throw new Error("the input phone number is not a string!");
        if(phone.trim().length === 0)
            throw new Error("the input phone number is not a valid string!");
        if(typeof email !== 'string')
            throw new Error("the input email is not a string!");
        if(email.trim().length === 0)
            throw new Error("the input email is not a valid string!");
        if(typeof address !== 'string')
            throw new Error("the input address is not a string!");
        if(address.trim().length === 0)
            throw new Error("the input address is not a valid string!");
        if(typeof zipcode !== 'string')
            throw new Error("the input zipcode is not a string!");
        if(zipcode.trim().length === 0)
            throw new Error("the input zipcode is not a valid string!");
        if(typeof username !== 'string')
            throw new Error("the input username is not a string!");
        if(username.trim().length === 0)
            throw new Error("the input username is not a valid string!");
        if(typeof password !== 'string')
            throw new Error("the input password is not a string!");
        if(password.trim().length === 0)
            throw new Error("the input password is not a valid string!");

        const newMember = {
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            age:age,
            phone:phone.trim(),
            email:email.trim(),
            address:address.trim(),
            zipcode:zipcode.trim(),
            username:username.trim(),
            password:password.trim(),
            comment:[],
            coursesEnrolled:[],
            trainers:[]
        };

        const memberCollection = await members();
        const insertInfo = await memberCollection.insertOne(newMember);
        if(insertInfo.insertedCount === 0)
            throw new Error('error! could not add member!');
        const newCourseId = insertInfo.insertedId.toString();
        const createMember = await this.getMemberById(newCourseId);
        return createMember;
    },
    async getAllMembers(){
        const memberCollection = await members();
        const memberList = await memberCollection.find({}).toArray();
        if(memberList.length === 0)
            throw new Error('error! No member in system!');
        for(let i = 0; i < memberList.length; i ++){
            memberList[i]._id = memberList[i]._id.toString();
        }
        return memberList;
    },
    async getMemberById(id){
        if(id == null) 
            throw new Error("you must provide an id to search for!");
        if(typeof id !== 'string') 
            throw new Error("the input value is not a string.");
        if(id.trim().length === 0) 
            throw new Error("the input string is not a valid string!");

        let parsedId = ObjectId(id);

        const memberCollection = await members();
        const member = await memberCollection.findOne({ _id: parsedId });
        if (!member) 
            throw new Error('No member with that id!');
        member._id = member._id.toString();
        return member;
    },
    async update(id, updateMember){
        if(id == null || updateTrainer == null)
            throw new Error("You must provid all fields!");
        if(typeof id !== 'string')
            throw new Error("the input id is not a string!");
        if(id.trim().length === 0)
            throw new Error("the input id is not a valid string!")
        if(typeof updateTrainer !== 'object' || Array.isArray(updateTrainer))
            throw new Error("the input updateMember is not a basic object!");
        
        let x = ObjectId(id);

        await this.getMemberById(id);

        let updateMemberInfo = {};

        if(updateMember.first_name)
            updateMemberInfo.first_name = updateMember.first_name;
        if(updateMember.last_name)
            updateMemberInfo.last_name = updateMember.last_name;
        if(updateMember.age)
            updateMemberInfo.age = updateMember.age;
        if(updateMember.phone)
            updateMemberInfo.phone = updateMember.phone;
        if(updateMember.email)
            updateMemberInfo.email = updateMember.email;
        if(updateMember.address)
            updateMemberInfo.address = updateMember.address;
        if(updateMember.zipcode)
            updateMemberInfo.zipcode = updateMember.zipcode;
        if(updateMember.username)
            updateMemberInfo.username = updateMember.username;             
        if(updateMember.password)
            updateMemberInfo.password = updateMember.password;

        
        const memberCollection = await members();
        const updatedInfo = await memberCollection.updateOne(
            {_id: x},
            {$set: updateMemberInfo}
        );
        if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) 
            throw new Error('member update failed');
        let res = await this.getMemberById(id);
        return res;
    },
    // async removeMember(id){
    //     if(id == null)
    //         throw new Error("You must provide an id to search for!")
    //     if(typeof id !== 'string')
    //         throw new Error("the input id is not a string!");
    //     if(id.trim().length === 0)
    //         throw new Error("the input value is not a valid string!");

    //     let x = ObjectId(id);
        
    //     const memberCollection = await members();

    //     await this.getMemberById(id);

    //     const deleteInfo = await memberCollection.removeOne({_id: x});
    //     if(deleteInfo.deleteCount === 0)
    //         throw new Error(`Could not delete member with id of ${id}`);
        
    //     return true;
    // },
    async addTrainerToMember(memberId, trainerId){
        if(trainerId == null || memberId == null)
            throw new Error("you should provide both trainerId and memberId to search for!")
        if(typeof trainerId !== 'string' || typeof memberId !== 'string')
            throw new Error("the input id is not a string!");
        
        let leftId = ObjectId(memberId);
        let rightId = ObjectId(trainerId);
        

        let curMember = await this.getMemberById(memberId);
        if(curMember == null)
            throw new Error("no memberId with that id!");
        //yan zheng trainer
        const trainerCollection = await trainers();
        await trainerCollection.findOne({_id: rightId});

        const memberCollection = await members();
        const updateInfo = await memberCollection.updateOne(
            {_id: leftId},
            {$addToSet: {trainers : trainerId}}
        );
        
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw new Error('Add trainer to member failed!');
        return await this.getMemberById(memberId);
    },
    async addCourseToMember(memberId, courseId){
        if(memberId == null || courseId == null)
            throw new Error("you should provide both memberId and courseId to search for!")
        if(typeof memberId !== 'string' || typeof courseId !== 'string')
            throw new Error("the input id is not a string!");
        
        let leftId = ObjectId(memberId);
        let rightId = ObjectId(courseId);
        

        let curMember = await this.getMemberById(memberId);
        if(curMember == null)
            throw new Error("no memberId with that id!");
        //验证course是否存在
        const courseCollection = await courses();
        await courseCollection.findOne({_id: rightId});

        const memberCollection = await members();
        const updateInfo = await memberCollection.updateOne(
            {_id: leftId},
            {$addToSet: {coursesEnrolled : courseId}}
        );
        
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw new Error('Add course to trainer failed!');
        return await this.getMemberById(memberId);
    },
    async addCommentToMember(memberId, commentId){
        if(memberId == null || commentId == null)
            throw new Error("you should provide both memberId and commentId to search for!")
        if(typeof memberId !== 'string' || typeof commentId !== 'string')
            throw new Error("the input id is not a string!");
        
        let leftId = ObjectId(memberId);
        let rightId = ObjectId(commentId);
        

        let curMember = await this.getMemberById(memberId);
        if(curMember == null)
            throw new Error("no memberId with that id!");
        //验证comment是否存在
        const commentCollection = await comments();
        await commentCollection.findOne({_id: rightId});

        const memberCollection = await members();
        const updateInfo = await memberCollection.updateOne(
            {_id: leftId},
            {$addToSet: {comment : commentId}}
        );
        
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw new Error('Add comment to member failed!');
        return await this.getMemberById(memberId);
    },
    async removeTrainerFromMember(memberId, trainerId){
        if(trainerId == null || memberId == null)
            throw new Error("you should provide both trainerId and memberId to search for!")
        if(typeof trainerId !== 'string' || typeof memberId !== 'string')
            throw new Error("the input id is not a string!");
        
        let leftId = ObjectId(memberId);
        let rightId = ObjectId(trainerId);
        

        let curMember = await this.getMemberById(memberId);
        if(curMember == null)
            throw new Error("no memberId with that id!");

        //verify  trainerId
        const trainerCollection = await trainers();
        await trainerCollection.findOne({_id: rightId});

        const memberCollection = await members();
        const updateInfo = await memberCollection.updateOne(
            {_id: leftId},
            {$pull: {trainers: trainerId}}
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw new Error('remove trainer from member failed');
        return await this.getMemberById(memberId);
    },
    async removeCourseFromMember(memberId, courseId){
        if(courseId == null || memberId == null)
            throw new Error("you should provide both trainerId and memberId to search for!")
        if(typeof courseId !== 'string' || typeof memberId !== 'string')
            throw new Error("the input id is not a string!");
        
        let leftId = ObjectId(memberId);
        let rightId = ObjectId(courseId);
        

        let curMember = await this.getMemberById(memberId);
        if(curMember == null)
            throw new Error("no memberId with that id!");

        //verify courseId
        const courseCollection = await courses();
        await courseCollection.findOne({_id: rightId});

        const memberCollection = await members();
        const updateInfo = await memberCollection.updateOne(
            {_id: leftId},
            {$pull: {coursesEnrolled: courseId}}
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw new Error('remove trainer from member failed');
        return await this.getMemberById(memberId);
    }
};
module.exports = exportedMethods;