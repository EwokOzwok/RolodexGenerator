How to deploy your Rolodex App:

Step 1: Include your resources .csv file in the main directory
- the filename of your CSV file must be named EXACTLY 'rolodex' (without single quotes)
- the CSV file MUST be exactly the same as the one you uploaded

Step 2: Download Docker Desktop
- You must have Docker Desktop installed to build the app
- Download Windows or Mac versions at https://www.docker.com/products/docker-desktop/

Step 3: Install Docker Desktop
- Install Docker Desktop on your computer

Step 4: Build the docker container
- Open up command prompt (windows) or terminal (mac)
- Navigate to the folder using the cd command
    - Example: Run the command below (change directory to match the location of the extracted Rolodex App)
      cd "C:/Users/Admin/Desktop/Rolodex App"
- Run the following two commands (found in 'Docker Build.txt')

docker build -f Dockerfile.txt -t rolodex .
docker run -d --restart=always -p 1222:1222 --name RolodexApp rolodex


Step 5: Access the locally running version of your app
- Open your browser and access the running docker container on:
  http://localhost:1222  
  or
  http://127.0.0.1:1222

Step 6: ADVANCED: Deploy to Cloud

- To deploy on a website/hosting service you may tag and push the docker container to docker hub (requires a free docker account). 

##########################
## Instructional Videos ##
##########################

# Tag and push a docker image to DockerHub
# https://www.youtube.com/watch?v=tJsrv_kPh30

# Deploy docker image on Google Cloud Run
# https://www.youtube.com/watch?v=7CvD6oHmYxU
