const mongoCollections = require("./mongoCollections");
let { ObjectId } = require('mongodb');
const trainers = mongoCollections.trainers;
const members = mongoCollections.members;
const courses = mongoCollections.courses;
const comments = mongoCollections.comments;

let exportedMethods = {
    async addTrainer(first_name, last_name, age, info, phone, email, address, zipcode, username, password, img){
        if(first_name == null || last_name == null || age == null || phone == null || email == null || address == null || zipcode == null || username == null || password == null || img == null)
            throw new Error("all fields need to have valid values!");
        if(typeof first_name !== 'string')
            throw new Error("the input first name is not a string!");
        if(first_name.trim().length === 0)
            throw new Error("the input first name is not a valid string!");
        if(typeof last_name !== 'string')
            throw new Error("the input last name is not a string!");
        if(last_name.trim().length === 0)
            throw new Error("the input last name is not a valid string!");
        // if(typeof age !== 'number')
        //     throw new Error("the input age is not a number!");
        // if(age < 18 || age > 100)
        //     throw new Error("the input age should be in the range of 18-100");
        if(typeof info !== 'string')
            throw new Error("the input info is not a string!");
        if(info.trim().length === 0)
            throw new Error("the input info is not a valid string!");
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
        if(typeof img !== 'string')
            throw new Error("the input img address is not a string!");
        if(img.trim().length === 0)
            throw new Error("the input img address is not a valid string!");

        const newTariner = {
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            age:age,
            phone:phone.trim(),
            info:info.trim(),
            email:email.trim(),
            address:address.trim(),
            zipcode:zipcode.trim(),
            username:username.trim(),
            password:password.trim(),
            rating:0,
            img: img,
            course:[],
            comment:[],
            members:[]
        };

        const trainerCollection = await trainers();
        const insertInfo = await trainerCollection.insertOne(newTariner);
        if(insertInfo.insertedCount === 0)
            throw new Error('error! could not add trainer!');
        const newTrainerId = insertInfo.insertedId.toString();
        const createTrainer = await this.getTrainerById(newTrainerId);
        return createTrainer;
    },
    async getTrainerByEmail(e){
        const trainerCollection = await trainers();
        const trainer = await trainerCollection.findOne({ email: e });
        if (!trainer)
            throw new Error('No member with that id!');
        trainer._id = trainer._id.toString();
        return trainer;
    },
    async getAllTrainers(){
        const trainerCollection = await trainers();
        const trainerList = await trainerCollection.find({}).toArray();
        if(trainerList.length === 0)
            throw new Error('error! No trainer in system!');
        for(let i = 0; i < trainerList.length; i ++){
            trainerList[i]._id = trainerList[i]._id.toString();
        }
        return trainerList;
    },
    async getTrainerById(id){
        if(id == null) 
            throw new Error("you must provide an id to search for!");
        if(typeof id !== 'string') 
            throw new Error("the input value is not a string.");
        if(id.trim().length === 0) 
            throw new Error("the input string is not a valid string!");

        let parsedId = ObjectId(id);

        const trainerCollection = await trainers();
        const trainer = await trainerCollection.findOne({ _id: parsedId });
        if (!trainer) 
            throw new Error('No trainer with that id!');
        trainer._id = trainer._id.toString();
        return trainer;
    },
    async update(id, updateTrainer){
        if(id == null || updateTrainer == null)
            throw new Error("You must provid all fields!");
        if(typeof id !== 'string')
            throw new Error("the input id is not a string!");
        if(id.trim().length === 0)
            throw new Error("the input id is not a valid string!")
        if(typeof updateTrainer !== 'object' || Array.isArray(updateTrainer))
            throw new Error("the input updateTrainer is not a basic object!");
        
        let x = ObjectId(id);

        await this.getTrainerById(id);

        let updateTrainerInfo = {};

        if(updateTrainer.first_name)
            updateTrainerInfo.first_name = updateTrainer.first_name;
        if(updateTrainer.last_name)
            updateTrainerInfo.last_name = updateTrainer.last_name;
        if(updateTrainer.age)
            updateTrainerInfo.age = updateTrainer.age;
        if(updateTrainer.phone)
            updateTrainerInfo.phone = updateTrainer.phone;
        if(updateTrainer.email)
            updateTrainerInfo.email = updateTrainer.email;
        if(updateTrainer.address)
            updateTrainerInfo.address = updateTrainer.address;
        if(updateTrainer.zipcode)
            updateTrainerInfo.zipcode = updateTrainer.zipcode;
        if(updateTrainer.username)
            updateTrainerInfo.username = updateTrainer.username;
        if(updateTrainer.password)
            updateTrainerInfo.password = updateTrainer.password;
        
        const trainerCollection = await trainers();
        const updatedInfo = await trainerCollection.updateOne(
            {_id: x},
            {$set: updateTrainerInfo}
        );
        if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) 
            throw new Error('trainer update failed');
        let res = await this.getTrainerById(id);
        return res;
    },
    // async removeTrainer(id){
    //     if(id == null)
    //         throw new Error("You must provide an id to search for!")
    //     if(typeof id !== 'string')
    //         throw new Error("the input id is not a string!");
    //     if(id.trim().length === 0)
    //         throw new Error("the input value is not a valid string!");

    //     let x = ObjectId(id);
        
    //     const trainerCollection = await trainers();

    //     await this.getTrainerById(id);

    //     const deleteInfo = await trainerCollection.removeOne({_id: x});
    //     if(deleteInfo.deleteCount === 0)
    //         throw new Error(`Could not delete trainer with id of ${id}`);
        
    //     return true;
    // },
    async addMemberToTrainer(trainerId, memberId){
        if(trainerId == null || memberId == null)
            throw new Error("you should provide both trainerId and memberId to search for!")
        if(typeof trainerId !== 'string' || typeof memberId !== 'string')
            throw new Error("the input id is not a string!");
        
        let leftId = ObjectId(trainerId);
        let rightId = ObjectId(memberId);
        

        let curTrainer = await this.getTrainerById(trainerId);
        if(curTrainer == null)
            throw new Error("no trainerId with that id!");
        //yan zheng member
        const memberCollection = await members();
        await memberCollection.findOne({_id: rightId});

        const trainerCollection = await trainers();
        const updateInfo = await trainerCollection.updateOne(
            {_id: leftId},
            {$addToSet: {members : memberId}}
        );
        
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw new Error('Add member to trainer failed!');
        return await this.getTrainerById(trainerId);
    },
    async addCourseToTrainer(trainerId, courseId){
        if(trainerId == null || courseId == null)
            throw new Error("you should provide both trainerId and courseId to search for!")
        if(typeof trainerId !== 'string' || typeof courseId !== 'string')
            throw new Error("the input id is not a string!");
        
        let leftId = ObjectId(trainerId);
        let rightId = ObjectId(courseId);
        

        let curTrainer = await this.getTrainerById(trainerId);
        //add verification to course
        const courseCollection = await courses();
        await courseCollection.findOne({_id: rightId});
        
        if(curTrainer == null)
            throw new Error("no trainerId with that id!");

        const trainerCollection = await trainers();
        const updateInfo = await trainerCollection.updateOne(
            {_id: leftId},
            {$addToSet: {course : courseId}}
        );
        
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw new Error('Add course to trainer failed!');
        return await this.getTrainerById(trainerId);
    },
    async removeMemberFromTrainer(trainerId, memberId){
        if(trainerId == null || memberId == null)
            throw new Error("you should provide both trainerId and memberId to search for!")
        if(typeof trainerId !== 'string' || typeof memberId !== 'string')
            throw new Error("the input id is not a string!");
        
        let leftId = ObjectId(trainerId);
        let rightId = ObjectId(memberId);
        

        let curTrainer = await this.getTrainerById(trainerId);
        if(curTrainer == null)
            throw new Error("no trainerId with that id!");
        //add verification to member
        const memberCollection = await members();
        await memberCollection.findOne({_id: rightId});      

        const trainerCollection = await trainers();
        const updateInfo = await trainerCollection.updateOne(
            {_id: leftId},
            {$pull: {members: memberId}}
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw new Error('remove member from trainer failed');
        return await this.getTrainerById(trainerId);
    },
    async addCommentToTrainer(trainerId, commentId){
        if(trainerId == null || commentId == null)
            throw new Error("you should provide both trainerId and commentId to search for!")
        if(typeof trainerId !== 'string' || typeof commentId !== 'string')
            throw new Error("the input id is not a string!");
        
        let leftId = ObjectId(trainerId);
        let rightId = ObjectId(commentId);
        

        let curTrainer = await this.getTrainerById(trainerId);
        if(curTrainer == null)
            throw new Error("no trainerId with that id!");
       //add verification to comment
       const commentCollection = await comments();
       await commentCollection.findOne({_id: rightId});

        const trainerCollection = await trainers();
        const updateInfo = await trainerCollection.updateOne(
            {_id: leftId},
            {$addToSet: {comment : commentId}}
        );
        
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw new Error('Add member to trainer failed!');
        return await this.getTrainerById(trainerId);
    },
    async getTopTrainer(){
        const trainerCollection = await trainers();
        const trainerList = await trainerCollection.find({}).toArray();
        if(trainerList.length === 0)
            throw new Error('error! No trainer in system!');
        var maxRating = parseFloat(trainerList[0].rating)
        var topTrainer = trainerList[0]
        for(let i = 0; i < trainerList.length; i ++){
            if(parseFloat(trainerList[i].rating)>maxRating){
                topTrainer = trainerList[i]
            }
        }

        topTrainer._id = topTrainer._id.toString();
        return topTrainer;
    }

};


module.exports = exportedMethods;