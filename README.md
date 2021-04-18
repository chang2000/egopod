# EgoPod, a web-based podcast app supports note taking



## Introduction

EgoPod is a full-functional podcast app. Egopod supports *Sign in with Google*. Users can search podcast, subscribe podcast and bookmark episodes. 



Egopod also supports note taking to help people write down the knowledge or inspiration from podcast. After taking the notes, users can export the notes and related audio clip with ease.

## Setup

This project is consisted of two parts: `clients` and `backend`

The client(frontend) is developed by [React](https://reactjs.org/), and the backend(apis) is developed by [Express](https://expressjs.com/). Database is (MySQL)[https://www.mysql.com/].

The whole project is currently deployed on an AWS EC2 instance. The client, backend and database are all running on [Docker](https://www.docker.com/). 

Here are the detailed instruction on setting up EgoPod.

### Prepared

- Docker
- Sign-in-with-Google API Key

### Client

Please figure out the local absloute path of this project.

1. Change the backend address in `config.js`
2. Use `docker run -p 80:3000 -v /home/ubuntu/egopod/client:/tmp/client -w /tmp/client  -it node bash` to start a container for client, while mapping the port.

3. Use `yarn` to install node modules.
4. Use `yarn start`  to start the dev mode.
5. Now you can checkout the front-end part of EgoPod. It's fully functional with basic podcast searching and playing, but it cannot deal with any user account related operations before configuring backend.



### Backend

1. Config your database information in `config.js`
2. Use `docker run -p 5000:5000 -v /home/ubuntu/egopod/backend:/tmp/backend -w /tmp/backend -it node bash` to start the container for backend.
3. Run `apt update`
4. Run `apt install ffmpeg`
5. Use `yarn` to install node modules
6. User `yarn start` to run the backend



### Database

Database for this project is developed on this [image](https://hub.docker.com/_/mysql).

Build up all the tables here.