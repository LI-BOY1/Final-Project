const express = require('express');
const router = express.Router();
const data = require('../data');
const memberData = data.members;
const trainerData = data.trainers;
const courseData = data.courses;
const commentData = data.comments;


router.get('/profile', async (req, res) => {
    try {
        let memberId = req.session.user.id;
        const member = await memberData.getMemberById(memberId);
        res.render('members/speMember', {member: member})
    } catch (e) {
        res.status(404).json({ error: `members can not be found with that id` });
    }
});

router.get('/schedule', async (req, res) => {

    let memberId = req.session.user.id;
    const member = await memberData.getMemberById(memberId);

    let result = await createObj(member);

    res.render('members/schedule', result);


});


// 利用 星期几和时间来锁定一门课
router.post('/delete', async(req, res) => {

    let {cancelDay, cancelTime} = req.body;
    let memberId = req.session.user.id;
    let member = await memberData.getMemberById(memberId);
    let list = member["coursesEnrolled"];

    let day = parseInt(cancelDay);
    let time = parseInt(cancelTime);
    let targetCourse = null;

    // 对于这个member，要知道他上过的所有course有哪些trainer，并且上了各自trainer的几门课
    let trainerFreq = {};

    for(let i = 0; i < list.length; i++){

        let courseId = list[i];
        let course = await courseData.getCourseById(courseId);

        // 对于每一门课，统计trainer的出现频率
        let tId = course["trainerId"];
        if(!trainerFreq[tId]){
            trainerFreq[tId] = 1;
        }else{
            trainerFreq[tId] = trainerFreq[tId] + 1;
        }

        if(course["day"] == day && course["start_time"] == time){
            targetCourse = course;
        }
    }


    console.log(trainerFreq);

    // 说明没有找到要删除的目标课程
    if(!targetCourse){

        let result = await createObj(member);
        result["cancelError"] = true;
        res.render('members/schedule', result);
        return;

    }else{

        // find the course we need to delete !!
        let trainerId = targetCourse["trainerId"];
        let trainer  = await trainerData.getTrainerById(trainerId);
        let courseId = targetCourse["_id"];

        //delete course from course db
        try {
            await courseData.deleteCourseById(courseId);
        }catch (e) {
            throw e;
        }

        // delete course id from trainer course array
        await trainerData.deleteCourse(trainerId, courseId);

        // delete course id from member coursesEnrolled array
        await memberData.deleteCourse(memberId, courseId)

        // 如果member只上了这个trainer的一门课，那么互相删除id

        if(trainerFreq[trainerId] == 1){
            await trainerData.deleteMember(trainerId, memberId);
            await memberData.deleteTrainer(memberId, trainerId);
        }


        res.render('members/speMember', {member: member, cancelSuccess: true});
        return;


        // //在 course db 里面添加这门课
        // const course = await courseData.addCourse(courseName, "This course is good for increasing muscle!", img, 290, parseInt(time), numDay, trainerId);
        // await courseData.addTAccIdToCourse(course._id, trainerObj.trainerAcId);
        // await courseData.addMemberToCourse(course._id, memberId);
        //
        //
        // // 在 trainer db 里的 course array 加上这门课的id
        // await trainerData.addCourseToTrainer(trainerId, course._id);
        //
        //
        // // 在 member db 里的 coursesEnrolled array 加上这门课的id
        // await memberData.addCourseToMember(memberId, course._id);
        //
        //
        // // 把这个 trainer的members array 加上这个memberid
        // await trainerData.addMemberToTrainer(trainerId, memberId);
        //
        // // 把这个 member的trainers array 加上这个trainerid
        // await memberData.addTrainerToMember(memberId, trainerId);






    }

});


async function createObj(member) {


    const courseIdList = member.coursesEnrolled;
    const courseInfo = {};
    let res = {};

    for(let i = 0; i < courseIdList.length; i ++){
        courseInfo[i] = await courseData.getCourseById(courseIdList[i]);
    }

    let monC = [], tueC = [], wenC = [], thuC = [], friC = [];
    for(let i in courseInfo){
        if(courseInfo[i].day === 1){
            monC.push(courseInfo[i]);
        }else if(courseInfo[i].day === 2){
            tueC.push(courseInfo[i]);
        }else if(courseInfo[i].day === 3){
            wenC.push(courseInfo[i]);
        }else if(courseInfo[i].day === 4){
            thuC.push(courseInfo[i]);
        }else{
            friC.push(courseInfo[i]);
        }
    }


    res["title"] = `${member.first_name} ${member.last_name}'s Course Schedule`;
    res["MondayCourse"] = monC;
    res["TuesdayCourse"] = tueC;
    res["WednesdayCourse"] = wenC;
    res["ThursdayCourse"] =  thuC;
    res["FridayCourse"] = friC;

    return res;

}






module.exports = router;