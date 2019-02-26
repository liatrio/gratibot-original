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
                script {
                    gitCommitHash = (git rev-parse HEAD) | awk '{print substr($0,0,10)}'
                    export TAG=gitCommitHash
                    docker build -t --pull ${IMAGE}:$TAG .
                }
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