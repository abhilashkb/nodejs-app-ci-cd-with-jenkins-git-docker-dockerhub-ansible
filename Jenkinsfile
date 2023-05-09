
def getVersion(){
 commitid = sh returnStdout: true, script: '''git rev-parse HEAD'''
 return commitid
}
def postStageNotification(String stageName, String stageResult) {
    post {
        always {
            script {
                if (stageResult == 'SUCCESS') {
                    // Send success message for the stage with completion time
                    script{
                        env.stageDuration = currentBuild.getDurationString()
                    }
                    slackSend(color: 'good', message: "${stageName} completed successfully. Total duration: ${stageDuration}")
                } else {
                    // Send failure message for the stage with error message
                    def errorMessage = currentBuild.rawBuild.getLog(1000).findAll { it.contains("[${stageName}]") }.last()
                    slackSend(color: 'danger', message: "${stageName} failed with error:\n${errorMessage}")
                }
            }
        }
    }
}
pipeline {
    agent any
    stages {
        stage('SCM checkout') {
            steps{
            catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') { 
            git branch: 'main', credentialsId: '3556331b-958c-41cd-b636-918833670bc2', url: 'https://github.com/abhilashkb/nodejs-app-ci-cd-with-jenkins-git-docker-dockerhub-ansible'
            script{
                env.DOCK_TAG = getVersion()
            }
            }
          postStageNotification('SCM checkout', currentBuild.result.toString())  
        }

        }
        stage("Docker Build"){
            steps{
                sh "docker build . -t 224574/nodejs-app:${DOCK_TAG}"
            }
        }
        stage("Docker Push"){
            steps{
                echo "${DOCK_TAG}"
                withCredentials([string(credentialsId: 'dockerhubpwd', variable: 'dockerhubpwd')]) {
                sh "docker login -u 224574 -p ${dockerhubpwd}"
                }
                sh "docker push 224574/nodejs-app:${DOCK_TAG}"
            }
        }
        stage("Container deployment using ansible-playbook"){
            steps{
                ansiblePlaybook credentialsId: '2b951aff-9d09-4210-946b-20a3391376f0', disableHostKeyChecking: true, extras: '-e DOCK_TAG="${DOCK_TAG}" -e W_PATH="${WORKSPACE}" -e docker_image_name=224574/nodejs-app', installation: 'ansible', inventory: 'inventory.txt', playbook: 'playbook.yml'
            }
        }
    }
}