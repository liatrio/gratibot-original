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
                    export TAG=$(git rev-parse --short=10 HEAD)
                    docker build --pull -t ${IMAGE}:${TAG} 
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