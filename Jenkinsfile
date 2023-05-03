pipeline {
    agent any
    stages {
        stage('SCM checkout') {
            stepsgit branch: 'main', credentialsId: '3556331b-958c-41cd-b636-918833670bc2', url: 'https://github.com/abhilashkb/nodejs-app-ci-cd-with-jenkins-git-docker-dockerhub-ansible' {
             script{
	          env.DOCK_TAG = getVersion()
             } 
            }
        
    }
    

def getVersion(){
    commitid = sh returnStdout: true, script: '''git rev-parse HEAD'''
    return commitid
}
    }