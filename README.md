Welcome to the work from team #3202! 

We are working closely with RATL to implement an Attendance Checker and Storage application. We hope to implement the ability to create new attendance rosters, edit the potential attendees on those rosters, store those rosters, and eventually export or visualize the data relating to those rosters.

As of this first semester, however, we are hoping to implement our first artifact of adding an attendee to the database. This means that we have a full-stack application that utilizes React on the frontend, Node.js & Express.js for the backend, and MongoDB for the database (MERN). Adding an attendee will actually add them to the database, though besides this main functionality that is where we stand right now. We are excited to add more features in the future!

# Setup Instructions #

Install dependencies by running `npm install` in both the client & server directories.

To run the user frontend webapp, create a terminal in the "client" directory and execute the command `npm start` in your terminal. To run the test server, create another terminal in the server directory & run `node server.mjs`.

If you get an error with either of those, you may not have installed depencies. A pop-up error stating "localhost:3000 failed to fetch" or similar when trying to access the database on the client application means you aren't running the backend server.

# Release Notes #

## Version 0.2.0 

**New Features**
* Added ability for admins to add users
* Added ability for admins to remove users
* Added ability for admins create programs
* Added ability for admins to assign attendees to programs programs

**Bug Fixes**
* Fetch error has been resolved

**Known Issues**
* The backend and frontend components are currently not linked properly


## Version 0.1.0 

**New Features**
* Added ability to register as an admin
* Implemented seperate logins for users and admins
* Added ability for admins to add new users

**Bug Fixes** \
N/A

**Known Issues**
* When the application first starts up, a Failed to Fetch error will occur but the application will run normally after closing the error message
