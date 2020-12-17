const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const bcrypt = require('bcryptjs');
const courses = data.courses;
const comments = data.comments;
const members = data.members;
const trainers = data.trainers;
const img = 'https://source.unsplash.com/collection/483251';
const staticData = require('../data/staticData');

async function main(){
    const db = await dbConnection();
    await db.dropDatabase();


    const info = 'I am trainer';
    const password = "123123";
    const hashedPassword = await bcrypt.hash(password, 12);

    const member_1 = await members.addMember("jiali", "chen", "201-7837438", "12345@gmail.com","123 Hoboken Ave, Jersey City, NJ",  "goodgirl", hashedPassword);
    const member_2 = await members.addMember("boyang", "li", "201-7837348", "chenjl3@stevens.edu","113 Congress Ave, Hoboken, NJ",  "boyang", hashedPassword);
    //
    // const member_3 = await members.addMember("John", "Smith", "901-7837348", "smjohn@stevens.edu","512 Congress Ave, Union City, NJ",  "GoWest", hashedPassword);

    //trainer_1 set both account
    const trainer_1 = await trainers.addTrainer("Joe", "Watson", info,"201-7832388", "yexiny@stevens.edu", "66 Hoboken Ave, Jersey City, NJ",  "joe", hashedPassword, img);
    const trainerAcc_1 = await members.addMember("Joe", "Watson", "201-7832388", "yexiny@stevens.edu", "66 Hoboken Ave, Jersey City, NJ",  "joe", hashedPassword);
    await members.markMemberAsTrainer(trainerAcc_1._id);
    await members.addTRegisterIdToTrianer(trainerAcc_1._id, trainer_1._id);

    //trainer_2 set both account
    const trainer_2 = await trainers.addTrainer("Cristina", "Ye", info,"922-7123388", "yec@outlook.com", "147 33rd Ave, Great Neck, NY",  "hello123", hashedPassword, img);
    const trainerAcc_2 = await members.addMember("Cristina", "Ye", "922-7123388", "yec@outlook.com", "147 33rd Ave, Great Neck, NY",  "hello123", hashedPassword);
    await members.markMemberAsTrainer(trainerAcc_2._id);
    await members.addTRegisterIdToTrianer(trainerAcc_2._id, trainer_2._id);

    //trainer 3 created
    const trainer_3 = await trainers.addTrainer("Jeny", "Wang", info,"6753-7579388", "sdsdadsa@outk.acom", "148 33rd, Great Neck, NJ",  "jenny", hashedPassword, img);
    const trainerAcc_3 = await members.addMember("Jeny", "Wang", "6753-7579388", "sdsdadsa@outk.acom", "148 33rd, Great Neck, NJ",  "jenny", hashedPassword);
    await members.markMemberAsTrainer(trainerAcc_3._id);
    await members.addTRegisterIdToTrianer(trainerAcc_3._id, trainer_3._id);


    // create course with member 1 and trainer 1
    await addcourse(member_1._id, trainer_1._id, trainerAcc_1._id, 1, 9);

    // create course with member1 and trainer 2
    await addcourse(member_1._id, trainer_2._id, trainerAcc_2._id, 2, 9);

    // create course with member1 and trainer 1
    await addcourse(member_1._id, trainer_1._id, trainerAcc_1._id, 3, 9);

    // create course with member 2 and trainer 1
    await addcourse(member_2._id, trainer_1._id, trainerAcc_1._id, 1, 10);

    // create course with member2 and trainer 2
    await addcourse(member_2._id, trainer_2._id, trainerAcc_2._id, 2, 10);

    // create course with member2 and trainer 1
    await addcourse(member_2._id, trainer_1._id, trainerAcc_1._id, 5, 10);


    // create course with member2 and trainer 2
    await addcourse(member_2._id, trainer_2._id, trainerAcc_2._id, 4, 9);


    // add commnet with memner 1 and trainer 1
    const comment_1 = await comments.addComment(member_1._id, member_1.username, "This trainer is so good!", trainer_1._id, 4);

    // add commnet with memner 2 and trainer 1
    const comment_2 = await comments.addComment(member_2._id, member_2.username, "This trainer is ok!", trainer_1._id, 2);

    // add commnet with memner 2 and trainer 1
    const comment_3 = await comments.addComment(member_2._id, member_2.username, "This trainer is bad!", trainer_1._id, 1);



    // add commnet with memner 1 and trainer 2
    const comment_4 = await comments.addComment(member_1._id, member_1.username, "This trainer is so good!", trainer_2._id, 5);

    // add commnet with memner 2 and trainer 2
    const comment_5 = await comments.addComment(member_2._id, member_2.username, "This trainer is ok!", trainer_2._id, 2);

    // add commnet with memner 2 and trainer 2
    const comment_6 = await comments.addComment(member_2._id, member_2.username, "This trainer is bad!", trainer_2._id, 1);


    console.log('Done seeding database');

    await db.serverConfig.close();    
}


async function addcourse(memberId, trainerId, trainerActId, day, time) {

    const course = await courses.addCourse("muscle", 'This course is good for increasing muscle!', img, 80, time, day, trainerId);
    await courses.addTAccIdToCourse(course._id, trainerActId);
    await trainers.addCourseToTrainer(trainerId, course._id);
    await members.addCourseToMember(memberId, course._id);
    await courses.addMemberToCourse(course._id, memberId);
    await trainers.addMemberToTrainer(trainerId, memberId);
    await members.addTrainerToMember(memberId, trainerId);

}




main();