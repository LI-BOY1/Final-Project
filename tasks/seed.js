const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const bcrypt = require('bcryptjs');
const courses = data.courses;
const comments = data.comments;
const members = data.members;
const trainers = data.trainers;


async function main(){
    const db = await dbConnection();
    await db.dropDatabase();

    const img = 'https://source.unsplash.com/collection/483251';
    const info = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!';
    const password = "123123";
    const hashedPassword = await bcrypt.hash(password, 12);

    const member_1 = await members.addMember("Boyang", "Li", "201-7837438", "ysd123@stevens.edu","123 Hoboken Ave, Jersey City, NJ",  "GoodBoy", hashedPassword);

    const member_2 = await members.addMember("JiaLi", "Chen", "201-7837348", "chenjl3@stevens.edu","113 Congress Ave, Hoboken, NJ",  "GoodGirl", hashedPassword);

    const member_3 = await members.addMember("John", "Smith", "901-7837348", "smjohn@stevens.edu","512 Congress Ave, Union City, NJ",  "GoWest", hashedPassword);

    //trainer_1 set both account
    const trainer_1 = await trainers.addTrainer("Joe", "Watson", info,"201-7832388", "yexiny@stevens.edu", "66 Hoboken Ave, Jersey City, NJ",  "joe", hashedPassword, img);
    const trainerAcc_1 = await members.addMember("Joe", "Watson", "201-7832388", "yexiny@stevens.edu", "66 Hoboken Ave, Jersey City, NJ",  "joe", hashedPassword);
    await members.markMemberAsTrainer(trainerAcc_1._id);
    await members.addTRegisterIdToTrianer(trainerAcc_1._id, trainer_1._id);

    //trainer_2 set both account
    const trainer_2 = await trainers.addTrainer("Cristina", "Ye", info,"922-7123388", "yec@outlook.com", "147 33rd Ave, Great Neck, NY",  "Hello123", hashedPassword, img);
    const trainerAcc_2 = await members.addMember("Cristina", "Ye", "922-7123388", "yec@outlook.com", "147 33rd Ave, Great Neck, NY",  "Hello123", hashedPassword);
    await members.markMemberAsTrainer(trainerAcc_2._id);
    await members.addTRegisterIdToTrianer(trainerAcc_2._id, trainer_2._id);

    const course_1 = await courses.addCourse("Muscle training_1", "This course is good for increasing muscle!", img, 290, 9, 1, trainer_1._id);
    await courses.addTAccIdToCourse(course_1._id, trainerAcc_1._id);
    const course_2 = await courses.addCourse("running_1", "You can have a good health and improve your health condition", img, 200, 10, 1, trainer_1._id);
    await courses.addTAccIdToCourse(course_2._id, trainerAcc_1._id);
    const course_3 = await courses.addCourse("running_2", "You can have a good health and improve your health condition", img, 270, 9, 2, trainer_1._id);
    await courses.addTAccIdToCourse(course_3._id, trainerAcc_1._id);

    //for schedule use--> trainer_1
    const makeUpC_1 = await courses.addCourse("training_2", info, img, 270, 9, 3, trainer_1._id);
    await courses.addTAccIdToCourse(makeUpC_1._id, trainerAcc_1._id);
    const makeUpC_2 = await courses.addCourse("training_3", info, img, 100, 12, 3, trainer_1._id);
    await courses.addTAccIdToCourse(makeUpC_2._id, trainerAcc_1._id);
    const makeUpC_3 = await courses.addCourse("training_4", info, img, 200, 14, 3, trainer_1._id);
    await courses.addTAccIdToCourse(makeUpC_3._id, trainerAcc_1._id);
    const makeUpC_4 = await courses.addCourse("training_5", info, img, 340, 16, 4, trainer_1._id);
    await courses.addTAccIdToCourse(makeUpC_4._id, trainerAcc_1._id);
    const makeUpC_5 = await courses.addCourse("training_6", info, img, 370, 12, 5, trainer_1._id);
    await courses.addTAccIdToCourse(makeUpC_5._id, trainerAcc_1._id);
    const makeUpC_6 = await courses.addCourse("training_7", info, img, 390, 16, 5, trainer_1._id);
    await courses.addTAccIdToCourse(makeUpC_6._id, trainerAcc_1._id);


    await trainers.addCourseToTrainer(trainer_1._id, course_1._id);
    await trainers.addCourseToTrainer(trainer_1._id, course_2._id);
    await trainers.addCourseToTrainer(trainer_1._id, course_3._id);
    await trainers.addCourseToTrainer(trainer_1._id, makeUpC_1._id);
    await trainers.addCourseToTrainer(trainer_1._id, makeUpC_2._id);
    await trainers.addCourseToTrainer(trainer_1._id, makeUpC_3._id);
    await trainers.addCourseToTrainer(trainer_1._id, makeUpC_4._id);
    await trainers.addCourseToTrainer(trainer_1._id, makeUpC_5._id);
    await trainers.addCourseToTrainer(trainer_1._id, makeUpC_6._id);

    const course_4 = await courses.addCourse("swimming", info , img, 200, 14, 1, trainer_2._id);
    await courses.addTAccIdToCourse(course_4._id, trainerAcc_2._id);
    const course_5 = await courses.addCourse("Running_1", info , img, 200, 9, 2, trainer_2._id);
    await courses.addTAccIdToCourse(course_5._id, trainerAcc_2._id);

    //for schedule use--> trainer_2
    const makeUpC_7 = await courses.addCourse("Climbing", info, img, 270, 12, 2, trainer_2._id);
    await courses.addTAccIdToCourse(makeUpC_7._id, trainerAcc_2._id);
    const makeUpC_8 = await courses.addCourse("Muscle", info, img, 100, 12, 3, trainer_2._id);
    await courses.addTAccIdToCourse(makeUpC_8._id, trainerAcc_2._id);
    const makeUpC_9 = await courses.addCourse("training_8", info, img, 200, 10, 4, trainer_2._id);
    await courses.addTAccIdToCourse(makeUpC_9._id, trainerAcc_2._id);
    const makeUpC_10 = await courses.addCourse("training_9", info, img, 340, 12, 4, trainer_2._id);
    await courses.addTAccIdToCourse(makeUpC_10._id, trainerAcc_2._id);
    const makeUpC_11 = await courses.addCourse("training_10", info, img, 370, 16, 4, trainer_2._id);
    await courses.addTAccIdToCourse(makeUpC_11._id, trainerAcc_2._id);
    const makeUpC_12 = await courses.addCourse("training_11", info, img, 390, 16, 5, trainer_2._id);
    await courses.addTAccIdToCourse(makeUpC_12._id, trainerAcc_2._id);

    await trainers.addCourseToTrainer(trainer_2._id, course_4._id);
    await trainers.addCourseToTrainer(trainer_2._id, course_5._id);
    await trainers.addCourseToTrainer(trainer_2._id, makeUpC_7._id);
    await trainers.addCourseToTrainer(trainer_2._id, makeUpC_8._id);
    await trainers.addCourseToTrainer(trainer_2._id, makeUpC_9._id);
    await trainers.addCourseToTrainer(trainer_2._id, makeUpC_10._id);
    await trainers.addCourseToTrainer(trainer_2._id, makeUpC_11._id);
    await trainers.addCourseToTrainer(trainer_2._id, makeUpC_12._id);


    

    console.log("member_1 select course_1 with trainer_1");
    // await members.addCourseToMember(member_1._id, course_1._id);
    // await courses.addMemberToCourse(course_1._id, member_1._id);
    // await trainers.addMemberToTrainer(trainer_1._id, member_1._id);
    // await members.addTrainerToMember(member_1._id, trainer_1._id);
    
    const comment_1 = await comments.addComment(member_1._id, member_1.username, "This trainer is so good!", trainer_1._id, 4);
    console.log(comment_1);

    console.log("member_2 select course_2 with trainer_1");
    // await members.addCourseToMember(member_2._id, course_2._id);
    // await courses.addMemberToCourse(course_2._id, member_2._id);
    // await trainers.addMemberToTrainer(trainer_1._id, member_2._id);
    // await members.addTrainerToMember(member_2._id, trainer_1._id);

    const comment_2 = await comments.addComment(member_2._id, member_2.username, "I love the trainers' teaching stytle in this class!", trainer_1._id, 5);
    console.log(comment_2);

    // console.log("member_3 select course_3 with trainer_2");
    // await members.addCourseToMember(member_3._id, course_3._id);
    // await courses.addMemberToCourse(course_3._id, member_3._id);
    // await trainers.addMemberToTrainer(trainer_2._id, member_3._id);
    // await members.addTrainerToMember(member_3._id, trainer_2._id);


    const comment_3 = await comments.addComment(member_3._id, member_3.username, "This is a good way to reduce fat!", trainer_2._id, 3);
    console.log(comment_3);

    const comment_4 = await comments.addComment(member_3._id, member_3.username, info, trainer_2._id, 2);

    //add extra trainers and courses in the db in order to test
    const trainer_3 = await trainers.addTrainer("trainer3", "Ben3", info,"6753-7579388", "sdsdadsa@outk.acom", "148 33rd, Great Neck, NJ",  "Hello123", hashedPassword, img);
    const trainerAcc_3 = await members.addMember("trainer3", "Ben3", "6753-7579388", "sdsdadsa@outk.acom", "148 33rd, Great Neck, NJ",  "Hello123", hashedPassword);
    await members.markMemberAsTrainer(trainerAcc_3._id);
    await members.addTRegisterIdToTrianer(trainerAcc_3._id, trainer_3._id);

    const trainer_4 = await trainers.addTrainer("John", "Ben", info,"123-7579388", "sdsa@outloaok.acom", "148 33rd Ave, Great Neck, NY",  "Hello123", hashedPassword, img);
    const trainerAcc_4 = await members.addMember("John", "Ben", "123-7579388", "sdsa@outloaok.acom", "148 33rd Ave, Great Neck, NY",  "Hello123", hashedPassword);
    await members.markMemberAsTrainer(trainerAcc_4._id);
    await members.addTRegisterIdToTrianer(trainerAcc_4._id, trainer_4._id);

    const trainer_5 = await trainers.addTrainer("Black", "Tim", info,"345-7123379", "yasdsdc@outlook.com", "149 33rd Ave, Small Neck, NY",  "Hello123", hashedPassword,img);
    const trainerAcc_5 = await members.addMember("Black", "Tim", "345-7123379", "yasdsdc@outlook.com", "149 33rd Ave, Small Neck, NY",  "Hello123", hashedPassword);
    await members.markMemberAsTrainer(trainerAcc_5._id);
    await members.addTRegisterIdToTrianer(trainerAcc_5._id, trainer_5._id);

    const trainer_6 = await trainers.addTrainer("Ben", "Gold", info,"678-71783388", "yasdac@outslook.com", "111 33rd Ave, Great Neck, NY",  "Hello123", hashedPassword, img);
    const trainerAcc_6 = await members.addMember("Ben", "Gold", "678-71783388", "yasdac@outslook.com", "111 33rd Ave, Great Neck, NY",  "Hello123", hashedPassword);
    await members.markMemberAsTrainer(trainerAcc_6._id);
    await members.addTRegisterIdToTrianer(trainerAcc_6._id, trainer_6._id);

    const trainer_7 = await trainers.addTrainer("Yo", "Parker", info,"468-7123981", "asdac@outlsook.com", "123 33rd St, Great Neck, NY",  "Hello123", hashedPassword, img);
    const trainerAcc_7 = await members.addMember("Yo", "Parker", "468-7123981", "asdac@outlsook.com", "123 33rd St, Great Neck, NY",  "Hello123", hashedPassword);
    await members.markMemberAsTrainer(trainerAcc_7._id);
    await members.addTRegisterIdToTrianer(trainerAcc_7._id, trainer_7._id);

    const trainer_8 = await trainers.addTrainer("Jenny", "Li", info,"784-71111388", "yasdac@outadsook.com", "124 33rd St, Great Neck, NY",  "Hello123", hashedPassword, img);
    const trainerAcc_8 = await members.addMember("Jenny", "Li", "784-71111388", "yasdac@outadsook.com", "124 33rd St, Great Neck, NY",  "Hello123", hashedPassword);
    await members.markMemberAsTrainer(trainerAcc_8._id);
    await members.addTRegisterIdToTrianer(trainerAcc_8._id, trainer_8._id);

    const trainer_9 = await trainers.addTrainer("Yi", "Tim", info,"145-71234588", "asdc@outlasdok.com", "126 33rd Ave, Great Neck, NY",  "Hello123", hashedPassword, img);
    const trainerAcc_9 = await members.addMember("Yi", "Tim", "145-71234588", "asdc@outlasdok.com", "126 33rd Ave, Great Neck, NY",  "Hello123", hashedPassword);
    await members.markMemberAsTrainer(trainerAcc_9._id);
    await members.addTRegisterIdToTrianer(trainerAcc_9._id, trainer_9._id);

    const trainer_10 = await trainers.addTrainer("Trainer10", "Tim", info,"566-71234588", "asdc@ou66tlasdok.com", "126 32rd , Great Neck, NY", "Hello123", hashedPassword, img);
    const trainerAcc_10 = await members.addMember("Trainer10", "Tim", "566-71234588", "asdc@ou66tlasdok.com", "126 32rd , Great Neck, NY", "Hello123", hashedPassword);
    await members.markMemberAsTrainer(trainerAcc_10._id);
    await members.addTRegisterIdToTrianer(trainerAcc_10._id, trainer_10._id);


    const course_6 = await courses.addCourse("swimming", info, img, 200, 12, 3, trainerAcc_3._id);
    await courses.addTAccIdToCourse(course_6._id, trainerAcc_3._id);
    const course_7 = await courses.addCourse("swimming", info, img, 200, 11, 3, trainerAcc_4._id);
    await courses.addTAccIdToCourse(course_7._id, trainerAcc_4._id);
    const course_8 = await courses.addCourse("swimming", info, img, 200, 10, 3, trainerAcc_5._id);
    await courses.addTAccIdToCourse(course_8._id, trainerAcc_5._id);
    const course_9 = await courses.addCourse("swimming", info, img, 200, 15, 3, trainerAcc_6._id);
    await courses.addTAccIdToCourse(course_9._id, trainerAcc_6._id);
    const course_10 = await courses.addCourse("swimming", info, img, 200, 13, 3, trainerAcc_7._id);
    await courses.addTAccIdToCourse(course_10._id, trainerAcc_7._id);
    const course_11 = await courses.addCourse("swimming", info, img, 200, 14, 3, trainerAcc_8._id);
    await courses.addTAccIdToCourse(course_11._id, trainerAcc_8._id);
    const course_12 = await courses.addCourse("swimming", info, img, 200, 16, 3, trainer_9._id);
    await courses.addTAccIdToCourse(course_12._id, trainerAcc_9._id);
    const course_13 = await courses.addCourse("swimming", info, img, 200, 12, 3, trainer_10._id);
    await courses.addTAccIdToCourse(course_13._id, trainerAcc_10._id);

    //add course to trainer-->we should add courseId in trainer db, because we need to search course in trainer page.(advise: delete trainer id in course db!!!!!)
    await trainers.addCourseToTrainer(trainer_3._id, course_6._id);
    await trainers.addCourseToTrainer(trainer_4._id, course_7._id);
    await trainers.addCourseToTrainer(trainer_5._id, course_8._id);
    await trainers.addCourseToTrainer(trainer_6._id, course_9._id);
    await trainers.addCourseToTrainer(trainer_7._id, course_10._id);
    await trainers.addCourseToTrainer(trainer_8._id, course_11._id);
    await trainers.addCourseToTrainer(trainer_9._id, course_12._id);
    await trainers.addCourseToTrainer(trainer_10._id, course_13._id);

    // member 2 course enrolled test (Xinyi_Ye) add course to member
    
    await members.addCourseToMember(member_2._id, course_1._id);
    await members.addCourseToMember(member_2._id, course_2._id);

    //add trainer to member
    
    await members.addTrainerToMember(member_2._id, trainer_1._id)
    await members.addTrainerToMember(member_2._id, trainer_1._id)






    console.log('Done seeding database');

    await db.serverConfig.close();    
}
main();