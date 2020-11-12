const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const courses = data.courses;
const comments = data.comments;
const members = data.members;
const trainers = data.trainers;

async function main(){
    const db = await dbConnection();
    await db.dropDatabase();

    const img = 'https://source.unsplash.com/collection/483251';
    const info = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!';
    const member_1 = await members.addMember("Boyang", "Li", 25, "201-7837438", "ysd123@stevens.edu","123 Hoboken Ave, Jersey City, NJ", "07310", "GoodBoy", "W123456");

    const member_2 = await members.addMember("JiaLi", "Chen", 23, "201-7837348", "chenjl3@stevens.edu","113 Congress Ave, Hoboken, NJ", "07312", "GoodGirl", "W12sasd6");

    const member_3 = await members.addMember("John", "Smith", 37, "901-7837348", "smjohn@stevens.edu","512 Congress Ave, Union City, NJ", "07012", "GoWest", "23231223236");

    const trainer_1 = await trainers.addTrainer("Xinyi", "Ye", 23, info,"201-7832388", "yexiny@stevens.edu", "66 Hoboken Ave, Jersey City, NJ", "07310", "Goirl", "W1sdsd23456", img);

    const trainer_2 = await trainers.addTrainer("Cristina", "Ye", 23, info,"922-7123388", "yec@outlook.com", "147 33rd Ave, Great Neck, NY", "11437", "Hello123", "W1sdsd23456", img);

    const course_1 = await courses.addCourse("Muscle training", "This course is good for increasing muscle!", img, 200, 12, 1, trainer_1._id);
    const course_2 = await courses.addCourse("running", "You can have a good health and improve your health condition", img, 200, 9, 3, trainer_1._id);
    const course_3 = await courses.addCourse("running", "You can have a good health and improve your health condition", img, 200, 12, 4, trainer_1._id);

    await trainers.addCourseToTrainer(trainer_1._id, course_1._id);
    await trainers.addCourseToTrainer(trainer_1._id, course_2._id);
    await trainers.addCourseToTrainer(trainer_1._id, course_3._id);

    const course_4 = await courses.addCourse("swimming", info , img, 200, 14, 2, trainer_2._id);
    const course_5 = await courses.addCourse("swimming", info , img, 200, 16, 4, trainer_2._id);
    await trainers.addCourseToTrainer(trainer_2._id, course_4._id);
    await trainers.addCourseToTrainer(trainer_2._id, course_5._id);


    

    console.log("member_1 select course_1 with trainer_1");
    // await members.addCourseToMember(member_1._id, course_1._id);
    // await courses.addMemberToCourse(course_1._id, member_1._id);
    // await trainers.addMemberToTrainer(trainer_1._id, member_1._id);
    // await members.addTrainerToMember(member_1._id, trainer_1._id);
    
    const comment_1 = await comments.addComment("This trainer is so good!", trainer_1._id, 7.7);
    console.log(comment_1);

    console.log("member_2 select course_2 with trainer_1");
    // await members.addCourseToMember(member_2._id, course_2._id);
    // await courses.addMemberToCourse(course_2._id, member_2._id);
    // await trainers.addMemberToTrainer(trainer_1._id, member_2._id);
    // await members.addTrainerToMember(member_2._id, trainer_1._id);

    const comment_2 = await comments.addComment("I love the trainers' teaching stytle in this class!", trainer_1._id, 8);
    console.log(comment_2);

    // console.log("member_3 select course_3 with trainer_2");
    // await members.addCourseToMember(member_3._id, course_3._id);
    // await courses.addMemberToCourse(course_3._id, member_3._id);
    // await trainers.addMemberToTrainer(trainer_2._id, member_3._id);
    // await members.addTrainerToMember(member_3._id, trainer_2._id);


    const comment_3 = await comments.addComment("This is a good way to reduce fat!", trainer_2._id, 7.5);
    console.log(comment_3);

    const comment_4 = await comments.addComment(info, trainer_2._id, 7.7);

    //add extra trainers and courses in the db in order to test
    const trainer_3 = await trainers.addTrainer("trainer3", "Ben3", 23, info,"6753-7579388", "sdsdadsa@outk.acom", "148 33rd, Great Neck, NJ", "11437", "Hello123", "W1sdsd23456", img);
    const trainer_4 = await trainers.addTrainer("John", "Ben", 23, info,"123-7579388", "sdsa@outloaok.acom", "148 33rd Ave, Great Neck, NY", "11437", "Hello123", "W1sdsd23456", img);
    const trainer_5 = await trainers.addTrainer("Black", "Tim", 23, info,"345-7123379", "yasdsdc@outlook.com", "149 33rd Ave, Small Neck, NY", "11437", "Hello123", "W1sdsd23456",img);
    const trainer_6 = await trainers.addTrainer("Ben", "Gold", 23, info,"678-71783388", "yasdac@outslook.com", "111 33rd Ave, Great Neck, NY", "11437", "Hello123", "W1sdsd23456", img);
    const trainer_7 = await trainers.addTrainer("Yo", "Parker", 23, info,"468-7123981", "asdac@outlsook.com", "123 33rd St, Great Neck, NY", "11437", "Hello123", "W1sdsd23456", img);
    const trainer_8 = await trainers.addTrainer("Jenny", "Li", 23, info,"784-71111388", "yasdac@outadsook.com", "124 33rd St, Great Neck, NY", "11437", "Hello123", "W1sdsd23456", img);
    const trainer_9 = await trainers.addTrainer("Yi", "Tim", 23, info,"145-71234588", "asdc@outlasdok.com", "126 33rd Ave, Great Neck, NY", "11437", "Hello123", "W1sdsd23456", img);
    const trainer_10 = await trainers.addTrainer("Trainer10", "Tim", 23, info,"566-71234588", "asdc@ou66tlasdok.com", "126 32rd , Great Neck, NY", "11437", "Hello123", "W1sdsd6", img);
    const course_6 = await courses.addCourse("swimming", info, img, 200, 12, 3, trainer_3._id);
    const course_7 = await courses.addCourse("swimming", info, img, 200, 11, 3, trainer_4._id);
    const course_8 = await courses.addCourse("swimming", info, img, 200, 10, 3, trainer_5._id);
    const course_9 = await courses.addCourse("swimming", info, img, 200, 15, 3, trainer_6._id);
    const course_10 = await courses.addCourse("swimming", info, img, 200, 13, 3, trainer_7._id);
    const course_11 = await courses.addCourse("swimming", info, img, 200, 14, 3, trainer_8._id);
    const course_12 = await courses.addCourse("swimming", info, img, 200, 16, 3, trainer_9._id);
    const course_13 = await courses.addCourse("swimming", info, img, 200, 12, 3, trainer_10._id);

    //add course to trainer-->we should add courseId in trainer db, because we need to search course in trainer page.(advise: delete trainer id in course db!!!!!)
    await trainers.addCourseToTrainer(trainer_3._id, course_6._id);
    await trainers.addCourseToTrainer(trainer_4._id, course_7._id);
    await trainers.addCourseToTrainer(trainer_5._id, course_8._id);
    await trainers.addCourseToTrainer(trainer_6._id, course_9._id);
    await trainers.addCourseToTrainer(trainer_7._id, course_10._id);
    await trainers.addCourseToTrainer(trainer_8._id, course_11._id);
    await trainers.addCourseToTrainer(trainer_9._id, course_12._id);
    await trainers.addCourseToTrainer(trainer_10._id, course_13._id);


    console.log('Done seeding database');

    await db.serverConfig.close();    
}
main();