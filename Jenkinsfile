pipeline {
    agent any

    environment {
        IMAGE='liatrio/gratibot'
        TAG='$(git rev-parse --short=10 HEAD)'
    }
    stages {
        stage('test') {
            environment { HOME="." }
            agent { 
                docker { image 'node:10.15-alpine' }
            }
            steps {
                sh 'npm install'
                sh 'npm test'
                sh 'printenv'
            }
        }
        stage('Build image') {
            steps {
                sh 'docker build --pull -t ${IMAGE}:$(git rev-parse --short=10 HEAD) -t ${IMAGE}:latest .'
            }
        }
        stage('Publish image') {
            when { 
                branch 'master'
            }
            steps {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'dockerPassword', usernameVariable: 'dockerUsername')]) {
                    sh "docker login -u ${env.dockerUsername} -p ${env.dockerPassword}"
                    sh "docker push ${env.IMAGE}:\$(git rev-parse --short=10 HEAD)"
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
}