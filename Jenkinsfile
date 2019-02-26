pipeline {
    agent any

    stages {
        stage('test') {
            agent { 
                docker { image 'node:10.15-alpine' }
            }
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }
        stage('Build image and push to registry') {
            environment {
                IMAGE='gratibot'
            }
            steps {
                sh 'docker build --pull -t ${IMAGE}:$(git rev-parse --short=10 HEAD) -t ${IMAGE}:latest .'
            }
        }
        stage('preprod') {
            steps {
                echo 'placeholder for preprod deployment'
            }
        }
        stage('preprod') {
            steps {
                echo 'placeholder for prod deployment'
            }
        }
    }
}