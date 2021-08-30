<h1>Build Dockerfile
1. docker build . -t tein1142/studart-project
<h1>Run Dockerfile
2. docker run --name studart-project -d --env-file .env -p 3000:3000 tein1142/studart-project