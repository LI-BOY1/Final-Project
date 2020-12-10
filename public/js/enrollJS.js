(function ($) {

    var myForm = $('#enroll-form');
    var myDay = $('#Day');
    var myTime = $('#Time');
    var error = $('#error');

    myForm.submit(function (event) {
        event.preventDefault();
        error.hide();

        let path = $(location).attr('href').toString();
        console.log(path);

        let day = myDay.val();
        let time = myTime.val();
        time = time.substr(0, time.indexOf(":"));


        // parse the trainer id, the courseName from url
        let courseName = path.substr( path.lastIndexOf("/")+1 );
        path = path.substr(0, path.lastIndexOf("/"));
        let trainerId = path.substr(path.lastIndexOf("/")+1);

        console.log(day);
        console.log(time);
        console.log(trainerId);
        console.log(courseName);

        let requestRoute = 'http://localhost:3000/enroll/enrollCourse/' + trainerId + '/' + courseName + '/' + day + '/' + time;
        console.log(requestRoute);

        $.ajax({
            url: requestRoute,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'GET',
            dataType: 'json'
        }).then((data) =>{


            console.log(data);


        });

    });




})(window.jQuery);
