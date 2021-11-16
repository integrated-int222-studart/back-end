<h1>Build Dockerfile<h1>
1. docker build . -t tein1142/studart-backend
docker build . -t tein1142/studart-frontend
<h1>Run Dockerfile<h1>
<!-- 2. docker run --name studart-project -d --env-file .env -p 3000:3000 tein1142/studart-project -->
docker container run --network studart-mysql --name studart-project -d --env-file .env -p 3000:3000 -d tein1142/studart-backend

<!-- docker run --name studart-frontend -d --env-file .env -p 8080:8080 tein1142/studart-frontend  -->
docker container run --network studart-mysql --name studart-frontend  -d --env-file .env -p 8080:8080 -d tein1142/studart-frontend 

<h1>Create Mysql network
docker network create studart-mysql  
docker container run --cap-add=sys_nice --name studart-mysql --network studart-network -e MYSQL_ROOT_PASSWORD=mypass123 -e MYSQL_DATABASE=Studart_System -p 3306:3306 -d mysql

<h1>Run image app in network
docker container run --network studart-network --name studart-project -d --env-file .env -p 3000:3000 -d tein1142/studart-project

docker container run --network studart-database-network --name studart-frontend -d --env-file .env -p 8080:80 -d studart-frontend


<h1>Connection database server
CONECTION=mysql://root:mypass123@13.76.182.102:3306/Studart_System

<h1>phpmyadmin container
docker run --name studart-myadmin -d --link studart-mysql:db --network studart-network -p 8081:80 phpmyadmin/phpmyadmin


docker run --detach -p 443:443 -p 80:80
/home/dohttps/nginx/data:/usr/share/nginx/html:rw
/home/dohttps/nginx/config/nginx.conf:/etc/nginx/nginx.conf/:rw
/home/dohttps/nginx/config/conf.d/default.conf:/etc/nginx/conf.d/default.conf:rw 
/home/dohttps/nginx/logs:/var/log/nginx/:rw
 /home/dohttps/nginx/ssl:/ssl/:rw -d nginx