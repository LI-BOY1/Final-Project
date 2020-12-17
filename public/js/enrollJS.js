(function ($) {

    var myForm = $('#enroll-form');
    var myDay = $('#Day');
    var myTime = $('#Time');


    myForm.submit(function (event) {
        event.preventDefault();
        $('#showList').empty();
        $('#showList').hide();

        let path = $(location).attr('href').toString();


        let day = myDay.val();
        let time = myTime.val();
        time = time.substr(0, time.indexOf(":"));


        // parse the trainer id, the courseName from url
        let courseName = path.substr( path.lastIndexOf("/")+1 );
        path = path.substr(0, path.lastIndexOf("/"));
        let trainerId = path.substr(path.lastIndexOf("/")+1);


        let requestRoute = 'http://localhost:3000/enroll/enrollCourse/' + trainerId + '/' + courseName + '/' + day + '/' + time;


        $.ajax({
            url: requestRoute,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'GET',
            dataType: 'json'
        }).then((data) =>{

            $('#showList').empty();
            console.log(data);

            let li = null;


            if(data.error){
                li = `<li><div class="alert alert-danger" role="alert"> you have time conflicts!</div></li>`;

            }else{
                li = `<li><div class="alert alert-success" role="alert"> you have enrolled!</div></li>`;
                window.location.href = "http://localhost:3000/members/schedule";
            }

            $('#showList').show();
            $('#showList').append(li);
        });

    });




})(window.jQuery);
