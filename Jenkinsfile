pipeline {
    agent any
    stages {
        stage('SCM checkout') {
            stepsgit branch: 'main', credentialsId: '3556331b-958c-41cd-b636-918833670bc2', url: 'https://github.com/abhilashkb/nodejs-app-ci-cd-with-jenkins-git-docker-dockerhub-ansible' {
             script{
	          env.DOCK_TAG = getVersion()
             } 
            }
        stage("Docker build"){
             sh "docker build . -t 224574/nodejs-app:${DOCK_TAG}"
        }
        stage('Docker Push'){
         withCredentials([string(credentialsId: 'dockerhubpwd', variable: 'dockerhubpwd')]) {
          sh "docker login -u 224574 -p ${dockerhubpwd}"
         }
       sh "docker push 224574/nodejs-app:${DOCK_TAG}"
        }
    }
    

def getVersion(){
    commitid = sh returnStdout: true, script: '''git rev-parse HEAD'''
    return commitid
}
  }