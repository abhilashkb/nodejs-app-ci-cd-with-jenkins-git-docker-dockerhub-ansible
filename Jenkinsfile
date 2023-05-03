pipeline {
    agent any
    stages {
        stage('SCM checkout') {
            steps{
                
            git branch: 'main', credentialsId: '3556331b-958c-41cd-b636-918833670bc2', url: 'https://github.com/abhilashkb/nodejs-app-ci-cd-with-jenkins-git-docker-dockerhub-ansible'
            
            }
        }
        stage("Docker build"){
            steps{
                echo ${DOCK_TAG}
                withCredentials([string(credentialsId: 'dockerhubpwd', variable: 'dockerhubpwd')]) {
                sh "docker login -u 224574 -p ${dockerhubpwd}"
                }
                sh "docker push 224574/nodejs-app:${DOCK_TAG}"
            }
        }
    }
}