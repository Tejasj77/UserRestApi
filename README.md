# User Management API

R.E.S.T API for managing users, allowing you to store, retrieve, update, and delete user records.

## Description

- This is a project that has storage,retrieve,updation and deletion functionality.
- Testing is enabled for all endpoints and coverage tests are also written encompassing the codebase.
- There is an inbuilt `mysql` wrapper package that serializes and deserializes objects directly without using third-party package.
- There is also a logging utility inbuilt which is used instead of writing `console.log` everywhere.

### Dependencies

- [Node.js][https://nodejs.org/en]
- [npm][https://www.npmjs.com/]
- [mysql][https://www.mysql.com/]

## Getting Started

    git clone https://github.com/Tejasj77/newRestApi.git

### Installing

- Run following command once moving into the repository after moving into the repository. Make sure to be in the same level as the `package.json` file.

```bash
    npm i
```

#### install docker

    echo "installing docker"
    sudo apt-get remove docker docker-engine docker.io containerd runc
    echo "added docker ppe"
    sudo apt-get update
    sudo apt-get install \
      apt-transport-https \
      ca-certificates \
      curl \
      gnupg-agent \
      software-properties-common -y
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    echo "added docker apt-key"
    sudo add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"
    sudo apt-get update
    echo "installing docker and docker-compose"
    sudo apt-get install docker docker-compose -y
    echo "setting up docker for current user"
    sudo usermod -aG docker $(whoami)

### Executing program

- First build the project

```bash
npm run build
```

- Run the following command in order to start `mysql`

```bash
docker-compose up
```

- Go to url `http://localhost:8080` in the browser
- Login into the phpmyadmin using following credentials

```bash
username:root
password:root
```

- Create a .env file alonside package.json. I have added PORT number and mysql_password in it for safety. Here, is a sample .env file

```bash
PORT=8000
MYSQL_DB_PASSWORD=root
```

- Create database crm

```bash
CREATE DATABASE crm;
```

- Running the project in development mode

```bash
npm run start:dev
```

- Running the project in development mode

```bash
npm run start:prod
```

### Executing tests

- In order to run test cases, please run the following command

```bash
npm run test
```

## API

#### /api/users

- `GET` : Get all users
- `POST` : Create a new user

#### /api/:userId

- `GET` : Get a specific user
- `PUT` : Update a specific user
- `DELETE` : Delete a specific user

## Help

Please refer following docs to tackle docker issues

```bash
https://docs.docker.com/compose/
```

## Todo

- [x] Adding load balancer capabilities.

## Authors

[Tejas Joshi][https://github.com/Tejasj77]
