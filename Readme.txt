Installing and using the web app

1) First install NodeJS .
   This application is tested on version 4.4.6 , but should work fine on any latest LTS version.

2) Runt npm install --save or yarn install .

3) Open env.js and makes changes accordingly.
   The testing mongodb url set on  process.env['MONGOLAB_URI_TESTING'] empties the db completely.

4) To unit and integration test this application , either run npm test or grunt test.
   For instructions on setting up grunt ,
   please read the documentation on https://gruntjs.com/getting-started

5) You can also run grunt default to automatically test this application and if no error is raised ,
    it will start the web server as well

6) The code is deployed on https://crudtask.herokuapp.com/

7) To run app without grunt , you can start the app with npm start or manually start by typing node app.js

8) A much richer documenation of the code is available on http://crud.kissr.com/index.html.
