# Welcome to Konoha's ninja race

## Project Introduction

This project was made for the intermediate js course from udacity. The API used is provided by Udacity's team.

## Getting Started

In order to build this game, we need to run two things: the game engine API and the front end.

### Start the Server

The game engine has been compiled down to a binary so that you can run it on any system. Because of this, you cannot edit the API in any way, it is just a black box that we interact with via the API endpoints.

To run the server, locate your operating system and run the associated command in your terminal at the root of the project.

| Your OS               | Command to start the API                                  |
| --------------------- | --------------------------------------------------------- |
| Mac                   | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-osx`   |
| Windows               | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server.exe`   |
| Linux (Ubuntu, etc..) | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-linux` |

Note that this process will use your terminal tab, so you will have to open a new tab and navigate back to the project root to start the front end.

If the previous does not work on window, you should try to run on powershell terminal:
`./bin/server.exe ORIGIN_ALLOWED=http://localhost:3000`

### Start the Frontend

First, run your preference of `npm install && npm start` or `yarn && yarn start` at the root of this project. Then you should be able to access http://localhost:3000.

### Story
Konoha wants to test the best ninjas in the village. For this reason, the 5th Hokage, Tsunade, created this race where the ninjas should not only trust on their speed and acceleration but also in their power ups as shinobis. You will select your preferred ninja and the circuit to race against the other shinobis. When the race is started, you should click on the ninja running button in order to accelerate and beat them all. Let's the race begin!

![image](https://user-images.githubusercontent.com/13615176/119879145-2fb7b680-bf2b-11eb-89df-da12984eb88a.png)
