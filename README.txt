Hello, welcome to this project.

To run this project, first, you need to run: "npm install", this will download all the external library.

Make sure you have your mongodb running all the time.

We already have some pre-populated data in the /tasks/seed.js, to dump all the data into the mongodb, run: node tasks/seed.js,
and you should see the data like below:

We have 4 collections: members, trainers, courses, comments, after all the data in seed.js stored in the db, you should have 5 record in members collections,
3 in trainers, 7 in courses, and 6 in comments

in total, we have 3 trainers, and 2 members(note: members collection store all the user data, and trainers collection only store trainer records)
everybody's password is: 123123

3 trainers' usernames are: joe, hello123, jenny
2 memebers' usernames are: goodgirl, boyang


Note: since this is the fitness club app, all the courses subject we provided is: 'running', 'bicycle', 'swimming', 'climbing', 'muscle', 'yoga'
you can't search any other courses besides the provided list.



To run this project: npm start , and go to the localhost: 3000

