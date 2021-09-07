<h1>Build Dockerfile<h1>
1. docker build . -t tein1142/studart-project
<h1>Run Dockerfile<h1>
2. docker run --name studart-project -d --env-file .env -p 3000:3000 tein1142/studart-project

docker container run --network studart-mysql --name studart-project -d --env-file .env -p 3000:3000 -d tein1142/studart-project

<h1>Create Mysql network
docker network create studart-network  
docker container run --name studart-mysql --network studart-network -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=Studart_System -d mysql

<h1>Run image app in network
docker container run --network studart-network --name studart-project -d --env-file .env -p 3000:3000 -d studart-project
