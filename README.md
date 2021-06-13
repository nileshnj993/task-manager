# task-manager
This is a basic **Task Manager** API that is made using **node.js** and deployed on **Heroku**. **Mongodb** has been used to store the User and Task related data. **Jestjs** was also used to verify the functioning of the API for various test cases.

## **Basic Functionality**

### User Model
1. Creating New User
2. Logging in with existing User
3. Logging out with logged in user (individual device and all devices)
4. Fetching details of logged in user
5. Updating details of logged in user
6. Deleting profile of logged in user
7. Uploading and deleting profile picture of logged in user

### Task Model
1. Creating new task associated to logged in user
2. Fetching all tasks of logged in user
3. Updating and deleting tasks of logged in user

The router and model files are available in the source code, where one can see the exact format needed to make the HTTP requests. 

##**Additional Functionality Provided**
1. Mail sent to newly registered users
2. Authorized access to personal tasks
3. Encrypted storing of passwords
4. Ability to add profile picture for your user
5. Automatically delete all tasks associated with a user, if the user is deleted

The API can be accessed at [Task Manager API](https://task-manager-nj.herokuapp.com) and the HTTP requests can be made using [Postman](https://www.postman.com/)

