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