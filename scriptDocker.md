<h1>Build Dockerfile<h1>
1. docker build . -t tein1142/studart-project
<h1>Run Dockerfile<h1>
2. docker run --name studart-project -d --env-file .env -p 3000:3000 tein1142/studart-project
docker container run --network studart-mysql --name studart-project -d --env-file .env -p 3000:3000 -d tein1142/studart-project

<h1>Create Mysql network
docker network create studart-network  
docker container run --name studart-mysql --network studart-network -e MYSQL_ROOT_PASSWORD=mypass123 -e MYSQL_DATABASE=Studart_System -p 3306:3306 -d mysql

<h1>Run image app in network
docker container run --network studart-network --name studart-project -d --env-file .env -p 3000:3000 -d tein1142/studart-project

<h1>Connection database server
CONECTION=mysql://root:mypass123@13.76.182.102:3306/Studart_System

<h1>phpmyadmin container
docker run --name studart-myadmin -d --link studart-mysql:db --network studart-network -p 8081:80 phpmyadmin/phpmyadmin