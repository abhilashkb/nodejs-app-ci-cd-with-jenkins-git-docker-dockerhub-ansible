
def getVersion(){
 commitid = sh returnStdout: true, script: '''git rev-parse HEAD'''
 return commitid
}
pipeline {
    agent any
    stages {
        stage('SCM checkout') {
            steps{
            slackSend (color: '#FFFF00', message: "STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
            catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') { 
            git branch: 'main', credentialsId: '3556331b-958c-41cd-b636-918833670bc2', url: 'https://github.com/abhilashkb/nodejs-app-ci-cd-with-jenkins-git-docker-dockerhub-ansible'
            script{
                env.DOCK_TAG = getVersion()
            }
            }
            
        }
        post {
            success {
                    // Send success message for Stage 1 with completion time
                    script{
                        env.stageDuration = currentBuild.getDurationString()
                    }
                 //   def stageDuration = currentBuild.getDurationString()
                    slackSend(color: 'good', message: "SCM checkout completed successfully, git commit_id: ${DOCK_TAG}. Total duration: ${stageDuration}")
            }
            failure {
                    // Send failure message for Stage 2 with error message
                   script{
                   env.errorMessage = currentBuild.rawBuild.getLog(1000).findAll { it.contains("[Stage 2]") }.last()
                   }
                    slackSend(color: 'danger', message: "SCM checkout failed with error:\n${errorMessage}")
                }
            }
        }
        stage('SonarQube Analysis') {
            steps{
                script{
                    scannerHome = tool name: 'sonarqube-scaner4.8', type: 'hudson.plugins.sonar.SonarRunnerInstallation'

                }
                echo "${scannerHome}"
                withSonarQubeEnv('sonarqube-server') {
                 sh "${scannerHome}/bin/sonar-scanner"
               }
        }
         post {
            success {
                    script{
                        env.stageDuration = currentBuild.getDurationString()
                    }
                    slackSend(color: 'good', message: "Sonar scan completed successfully. Total duration: ${stageDuration}")
            }
            failure {
                  slackSend(color: 'danger', message: " Sonar scan failed with error")
                  error("Pipeline stopped due to failure")
                }
            }           
        }
        stage('Quality Gate Check') {
        steps {
         script {
          def qg = waitForQualityGate()   
          if (qg.status != 'OK') {
            slackSend(color: 'good', message: "Pipeline aborted due to quality gate failure: ${qg.status}")
            error "Pipeline aborted due to quality gate failure: ${qg.status}"
        } else {
            slackSend(color: 'good', message: "SonarQube analysis Quality gate passed!")

        }
  
        }
      }
        }
        stage("Docker Build"){
            steps{
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') { 
                sh "docker build . -t 224574/nodejs-app:${DOCK_TAG}"
                }
            }
         post {
            success {
                    script{
                        env.stageDuration = currentBuild.getDurationString()
                    }
                    slackSend(color: 'good', message: "Docker Build Stage completed successfully. Total duration: ${stageDuration}")
            }
            failure {
                  slackSend(color: 'danger', message: " Docker Build Stage failed with error")
                  error("Pipeline stopped due to failure")
                }
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
         post {
            success {
                    // Send success message for Stage 1 with completion time
                    script{
                        env.stageDuration = currentBuild.getDurationString()
                    }
                 //   def stageDuration = currentBuild.getDurationString()
                    slackSend(color: 'good', message: "Docker Push Stage completed successfully. Total duration: ${stageDuration}")
            }
            failure {
                    // Send failure message for Stage 2 with error message
                  slackSend(color: 'danger', message: " Docker Push Stage failed with error")
                  error("Pipeline stopped due to failure")
                }
            }           
        }
        stage("Container deployment using ansible-playbook"){
            steps{
                ansiblePlaybook credentialsId: '2b951aff-9d09-4210-946b-20a3391376f0', disableHostKeyChecking: true, extras: '-e DOCK_TAG="${DOCK_TAG}" -e W_PATH="${WORKSPACE}" -e docker_image_name=224574/nodejs-app', installation: 'ansible', inventory: 'inventory.txt', playbook: 'playbook.yml'
            }
         post {
            success {
                    // Send success message for Stage 1 with completion time
                    script{
                        env.stageDuration = currentBuild.getDurationString()
                    }
                 //   def stageDuration = currentBuild.getDurationString()
                    slackSend(color: 'good', message: "Container deploymnet Stage completed successfully. Total duration: ${stageDuration}")
            }
            failure {
                    // Send failure message for Stage 2 with error message
                  slackSend(color: 'danger', message: " Container deploymnet Stage failed with error")
                  error("Pipeline stopped due to failure")
                }
            }           
        }
    }
    post {
        always {
            script {
                if (currentBuild.result == 'FAILURE') {
                    // Send failure message if pipeline fails
                    slackSend(color: 'danger', message: 'Pipeline failed or encountered errors.')
                    slackSend (color: '#FF0000', message: "FAILED: '[${env.BUILD_NUMBER}]' Check console output at: ${env.BUILD_URL}console")

                } else {
                    // Send overall success message with pipeline completion time
                    def pipelineDuration = currentBuild.getDurationString()
                    slackSend(color: 'good', message: "Pipeline completed successfully. Total duration: ${pipelineDuration}")
                }
            }
        }
    }
}