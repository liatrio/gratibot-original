pipeline {
    agent none 

    environment {
        IMAGE='liatrio/gratibot'
        SLACK_CHANNEL="flywheel"
    }
    stages {
        stage('Unit test') {
            environment { HOME="." }
            agent { 
                docker { image 'node:10.15-alpine' }
            }
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }
        stage('Build image') {
            agent { 
                docker { 
                    image 'docker:18.09' 
                    args  '--privileged	-u 0 -v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                sh "docker build --pull -t ${IMAGE}:${GIT_COMMIT[0..10]} -t ${IMAGE}:latest ."
            }
        }
        stage('Publish image') {
            when { 
                branch 'master'
            }
            agent { 
                docker { 
                    image 'docker:18.09' 
                    args  '--privileged	-u 0 -v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'dockerPassword', usernameVariable: 'dockerUsername')]) {
                    sh "docker login -u ${env.dockerUsername} -p ${env.dockerPassword}"
                    sh "docker push ${IMAGE}:${GIT_COMMIT[0..10]}"
                }
            }
        }
        stage('Preprod environment deploy') {
            steps {
                echo 'placeholder for preprod deployment'
            }
        }
        stage('Prod environment deploy') {
            steps {
                echo 'placeholder for prod deployment'
            }
        }
    }
    post {
        regression {
            slackSend channel: "#${env.SLACK_CHANNEL}",  color: "danger", message: "Build regression: ${env.JOB_NAME} on build #${env.BUILD_NUMBER} (<${env.BUILD_URL}|go there>)"
        }
        fixed {
            slackSend channel: "#${env.SLACK_CHANNEL}", color: "good",  message: "Build recovered: ${env.JOB_NAME} on #${env.BUILD_NUMBER}"
        }
    }
}
