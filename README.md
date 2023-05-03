# Node.js App Deployment with Jenkins, Docker, DockerHub, and Ansible

This project demonstrates how to automate the deployment of a Node.js app using a Jenkins pipeline with Docker, DockerHub, and Ansible.

## Overview

The deployment process involves the following steps:

1. Jenkins builds a Docker image for the Node.js app and pushes it to DockerHub.
2. Jenkins triggers an Ansible playbook to deploy the Docker image on a remote Docker host.
3. Ansible pulls the Docker image from DockerHub, stops and removes any running containers that were created from the same image, and runs a new container from the updated image.

## Prerequisites

Before you begin, ensure that you have the following prerequisites:

- Jenkins server with Docker and Ansible plugins installed.
- DockerHub account to store Docker images.
- Ansible installed on the Jenkins server and the remote Docker host.
- Docker Python module installed on the remote Docker host.

## Getting Started

1. Clone this repository to your local machine:
   ```
   git clone https://github.com/abhilashkb/nodejs-app-ci-cd-with-jenkins-git-docker-dockerhub-ansible.git
   ```
2. Create a new Jenkins pipeline job and configure it to use this repository as the source code repository. Refer to the sample pipeline script in the previous section to configure the pipeline stages.
3. Add the DockerHub credentials, Ansible SSH user credentials, and Ansible SSH private key credentials to the Jenkins credential store.
4. Modify the Ansible playbook (e.g., change the container port mappings or add environment variables) to suit your specific requirements.
5. Run the Jenkins pipeline job and monitor the console output for any errors.


## Acknowledgments

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Docker Documentation](https://docs.docker.com/)
- [Ansible Documentation](https://docs.ansible.com/)