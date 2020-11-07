const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const courses = data.courses;
const comments = data.comments;
const members = data.members;
const trainers = data.trainers;

async function main(){
    const db = await dbConnection();
    await db.dropDatabase();

    const member_1 = await members.addMember("Boyang", "Li", 25, "201-7837438", "ysd123@stevens.edu","123 Hoboken Ave, Jersey City, NJ", "07310", "GoodBoy", "W123456");

    const member_2 = await members.addMember("JiaLi", "Chen", 23, "201-7837348", "chenjl3@stevens.edu","113 Congress Ave, Hoboken, NJ", "07312", "GoodGirl", "W12sasd6");

    const member_3 = await members.addMember("John", "Smith", 37, "901-7837348", "smjohn@stevens.edu","512 Congress Ave, Union City, NJ", "07012", "GoWest", "23231223236");

    const trainer_1 = await trainers.addTrainer("Xinyi", "Ye", 23, "201-7832388", "yexiny@stevens.edu", "666 Hoboken Ave, Jersey City, NJ", "07310", "GoodGirl", "W1sdsd23456", 7.6);

    const trainer_2 = await trainers.addTrainer("Cristina", "Ye", 23, "922-7123388", "yec@outlook.com", "147 33rd Ave, Great Neck, NY", "11437", "Hello123", "W1sdsd23456", 7.6);

    const course_1 = await courses.addCourse("Muscle training", "This course is good for increasing muscle!", 12, 5, trainer_1._id);
    const course_2 = await courses.addCourse("running", "You can have a good health and improve your health condition", 9, 4, trainer_1._id);

    const course_3 = await courses.addCourse("Aerobics", "This lesson is good for losing your fat.", 6, 1, trainer_2._id);

    console.log("member_1 select course_1 with trainer_1");
    await members.addCourseToMember(member_1._id, course_1._id);
    await courses.addMemberToCourse(course_1._id, member_1._id);
    await trainers.addMemberToTrainer(trainer_1._id, member_1._id);
    await members.addTrainerToMember(member_1._id, trainer_1._id);
    
    const comment_1 = await comments.addComment(member_1._id, course_1._id, "This trainer is so good!", trainer_1._id, 7.7);
    console.log(comment_1);

    console.log("member_2 select course_2 with trainer_1");
    await members.addCourseToMember(member_2._id, course_2._id);
    await courses.addMemberToCourse(course_2._id, member_2._id);
    await trainers.addMemberToTrainer(trainer_1._id, member_2._id);
    await members.addTrainerToMember(member_2._id, trainer_1._id);

    const comment_2 = await comments.addComment(member_2._id, course_2._id, "I love the trainers' teaching stytle in this class!", trainer_1._id, 8);
    console.log(comment_2);

    console.log("member_3 select course_3 with trainer_2");
    await members.addCourseToMember(member_3._id, course_3._id);
    await courses.addMemberToCourse(course_3._id, member_3._id);
    await trainers.addMemberToTrainer(trainer_2._id, member_3._id);
    await members.addTrainerToMember(member_3._id, trainer_2._id);

    const comment_3 = await comments.addComment(member_3._id, course_3._id, "This is a good way to reduce fat!", trainer_2._id, 7.5);
    console.log(comment_3);


    //NEED TO SOLVE: RATING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //32333333333333333333333333
    //32333333333333333333333333
    //32333333333333333333333333
    console.log('Done seeding database');

    await db.serverConfig.close();    
}
main();