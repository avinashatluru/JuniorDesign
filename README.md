Welcome to the work from team #3202! 

We are working closely with RATL to implement an Attendance Checker and Storage application. We hope to implement the ability to create new attendance rosters, edit the potential attendees on those rosters, store those rosters, and eventually export or visualize the data relating to those rosters.

As of this first semester, however, we are hoping to implement our first artifact of adding an attendee to the database. This means that we have a full-stack application that utilizes React on the frontend, Node.js & Express.js for the backend, and MongoDB for the database (MERN). Adding an attendee will actually add them to the database, though besides this main functionality that is where we stand right now. We are excited to add more features in the future!

# Setup Instructions #

Install dependencies by running `npm install` in both the client & server directories.

To run the user frontend webapp, create a terminal in the "client" directory and execute the command `npm start` in your terminal. To run the test server, create another terminal in the server directory & run `node server.mjs`.

If you get an error with either of those, you may not have installed depencies. A pop-up error stating "localhost:3000 failed to fetch" or similar when trying to access the database on the client application means you aren't running the backend server.

# Installation Guide #

## Pre-requisites
In order to utilizes this application, you will need to have the latest version of Visual Studio Code installed and your device must be able to support MongoDB and JavaScript.

**Requirements For Visual Studio Code:**
* Windows 10 and 11 (64-bit)
* macOS versions with Apple security update support. This is typically the latest release and the two previous versions.
* Linux (Debian): Ubuntu Desktop 20.04, Debian 10
* Linux (Red Hat): Red Hat Enterprise Linux 8, Fedora 36

**Requirements For MongoDB:**
* At least 10 GB of free disk space plus a sufficient amount of space to hold your MongoDB data
* At least 4 GB of RAM
* If you use AWS EC2 instances, you should use a minimum of an m5.large instance

## Dependent Libraries
These are the required libraries that must be installed on your device to run this application:
* npm: Version 9.8.0
* node.js: Version 18.17.0
* cors: Version 2.8.5
* dotenv: Version 16.4.4
* express: Version 4.19.2
* mongodb: Version 5.7.0
* mongoose: Version 8.3.2
* mongose: Version 0.0.2-security
* @emotion/react: Version 11.11.4
* @emotion/styled: Version 11.11.0
* @mui/material: Version 5.15.11
* @mui/x-charts: Version 6.19.5
* @emotion/styled: Version 11.11.0
* @mui/x-charts: Version 6.19.5
* @testing-library/jest-dom: Version 5.17.0
* @testing-library/react: Version 13.4.0
* @testing-library/user-event: Version 13.5.0
* axios: Version 1.6.7
* bootstrap: Version 5.3.0
* chart.js: Version 4.4.2
* react: Version 18.2.0
* react-chartjs-2: Version 5.2.0
* react-dom: Version 18.2.0
* react-router-dom: Version 6.21.3
* react-scripts: 5.0.1
* react-select: Version 5.8.0
* web-vitals: Version 2.1.4

## Download Instructions
In order to download this project, simply navigate the main page of this repository and click **Releases** to the right of the files list. Afterwords, you will be given the option to download the latest version of the application source code as either a zip file or a tar.gz file. To download older versions of this application, click **Tags** on the upper-left section of the screen and select the desired version.

## Build and Installation
Not applicable

## Run Instructions
In order to run this application, you unzip the downloaded source code and upload it into Visual Studio Code, **VS code**. 
After all the source code and necessary dependencies are installed, open a terminal in **VS code** by clicking on the 3 dots at the top of the screen, selecting **Terminal** and clicking **New Terminal**. 
Once the terminal is open, navigate to the **server** directory using the appropriate commands and run the lines 'npm i' and 'node server.mjs'. If everything was properly installed, you should receive the message that server is running and that MongoDB is connected. 
Now, open a new terminal and navigate to the **client** directory the same way you navigated to **server** and run the lines 'npm i' and 'npm start'.
This should open a new window in your device's default browser which contains the application.

# Release Notes #

## Version 0.4.0 

**New Features**
* Consolidated UI for program management, attendee management, and attendance functions into Homepage
* Added ability to view attendance data by age distribution
* Added ability to view which programs were attended by attendees

**Bug Fixes**
* None

**Known Issues**
* None

## Version 0.3.0 

**New Features**
* Added ability to export data as CSV files by program
* Added ability to view particiaption by program
* Added ability to view all attendees assigned to a program and mark attendance
* added ability to edit and remove attendees
* Removed "User" term

**Bug Fixes**
* Program creation now connected to backend
* Attendee assignment to program connect to backend 

**Known Issues**
* None

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
