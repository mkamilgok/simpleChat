# simpleChat

This project is the implementation of simple chat application server.

- I have never used Node.js, Express, Mongoose before, but I was planning to learn it. That's why through this project first I learned all of these technologies(Node.js , Express Framework, Mongoose and Authentication with Passport.js) and then implemented naively for this application. Definitely, the code would be more modularized & organized but these were my baby steps with these tech stack.
- I managed to implement a REST API but I couldn't integrate websockets to the application.

- Although I tried to dockerize app, I couldn't test it because my Windows Home Edition is not able to install Docker.

- Unfortunately, I did not have time to code test cases of this project.

- For development purposes, I used Postman.

## EndPoints

### /register (POST)
Enables registering a new user. The request body should have values for these attributes : username, email, password.

### /login (POST)
Enables logining with a registered user. The request body should have values for these attributes : email, password.

### /log (GET)
Retrieves the saved logs for the current user.

### /logout (DELETE)
Logs out for the current user.

### /chats/send/:username (POST)
Enables sending message from current user to the username given as parameter. The request body should have the value for this attribute : messageText.

### /chats/:username/:daysAgo (GET)
Retrieves the messages between the current user and the user with the given username as parameter. "daysAgo" parameter is used to determine the date of messages.
The messages that are obtained will have a date greater then (currentDate-daysAgo). For example, if "daysAgo" parameter is equals to 7, only the messages that are sent in the last week will be retrieved.

### /chats/block/:username (POST)
Enables current user to block the user with the given username.

### /chats/unblock/:username (DELETE)
Enables current user to remove block for the user with the given username.
