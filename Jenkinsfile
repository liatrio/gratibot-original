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
            steps {
                echo 'placeholder for later builds'
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