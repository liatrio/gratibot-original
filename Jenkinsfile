pipeline {
    agent none 

    environment {
        IMAGE='liatrio/gratibot'
        SLACK_CHANNEL="chatops-dev"
        APP_DOMAIN='liatr.io'
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
                    sh "docker push ${IMAGE}:latest"
                }
            }
        }
        stage('Preprod environment deploy') {
            when {
                branch 'master'
            }
            agent {
                docker { image 'hashicorp/terraform:light' }
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'AWS-SVC-Jenkins-non-prod-dev' ]]) {
                    sh """
                    cd infrastructure
                    terraform init -input=false -no-color -force-copy -reconfigure
                    terraform plan -out=plan_nonprod_gratibot -input=false -no-color -var app_image=docker.io/${IMAGE}:${GIT_COMMIT[0..10]} -var domain=${APP_DOMAIN} -var app_host='dev.gratibot'
                    terraform apply -input=false plan_nonprod_gratibot -no-color
                    """
                }
            }
        }
        stage('Prod environment deploy') {
            when {
                branch 'master'
            }
            agent {
                docker { image 'hashicorp/terraform:light' }
            }
            steps {
                slackSend channel: "#${env.SLACK_CHANNEL}", message: "Promote gratibot: (<${env.BUILD_URL}|Go to job to approve/deny>)"
                input('Proceed to production?')
                  withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'AWS-SVC-Jenkins-prod-dev' ]]) {
                    sh """
                    cd infrastructure
                    terraform init -input=false -no-color -force-copy -reconfigure -backend-config="bucket=slackbots-prod-tfstates"
                    terraform plan -out=plan_prod_gratibot -input=false -no-color -var app_image=docker.io/${IMAGE}:${GIT_COMMIT[0..10]} -var domain=${APP_DOMAIN} -var app_host='gratibot'
                    terraform apply -input=false plan_prod_gratibot -no-color
                    """
                }
            }
        }
    }
    post {
        failure {
            slackSend channel: "#${env.SLACK_CHANNEL}",  color: "danger", message: "Build failed: ${env.JOB_NAME} on build #${env.BUILD_NUMBER} (<${env.BUILD_URL}|go there>)"
        }
        fixed {
            slackSend channel: "#${env.SLACK_CHANNEL}", color: "good",  message: "Build recovered: ${env.JOB_NAME} on #${env.BUILD_NUMBER}"
        }
    }
}
