pipeline {
    agent none 

    environment {
        IMAGE='liatrio/gratibot'
        SLACK_CHANNEL="flywheel"
        APP_DOMAIN='liatr.io'
    }
    stages {
        stage('Unit test') {
            environment { HOME="." }
            agent {
                label "jenkins-nodejs"
            }
            steps {
                container('nodejs') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }
        stage('Build image') {
            agent { 
                label "jenkins-jx-base"
            }
            steps {
                container('jx-base') {
                    sh "docker build --pull -t ${IMAGE}:${GIT_COMMIT[0..10]} ."
                }
            }
        }
        stage('Publish image') {
            agent { 
                label "jenkins-jx-base"
            }
            steps {
                container('jx-base') {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'dockerPassword', usernameVariable: 'dockerUsername')]) {
                        sh "docker login -u ${env.dockerUsername} -p ${env.dockerPassword}"
                        sh "docker push ${IMAGE}:${GIT_COMMIT[0..10]}"
                        sh "docker rmi ${IMAGE}:${GIT_COMMIT[0..10]}"
                    }
                }
            }
        }
        stage('Preprod environment deploy') {
            when {
                branch 'master'
            }
            agent {
                label "jenkins-terraform"
            }
            steps {
                container('terraform') {
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'AWS-SVC-Jenkins-non-prod-dev' ]]) {
                        sh """
                        cd infrastructure
                        terraform init -input=false -no-color -force-copy -reconfigure
                        terraform plan -out=plan_nonprod_gratibot -input=false -no-color -var app_image=docker.io/${IMAGE}:${GIT_COMMIT[0..10]} -var domain='liatr.io' -var app_host='dev.gratibot'
                        terraform apply -input=false plan_nonprod_gratibot -no-color
                        """
                    }
                }
                slackSend channel: "#${env.SLACK_CHANNEL}", message: "Promote gratibot: (<${env.BUILD_URL}|Go to job to approve/deny>)"
            }
        }
        stage('Prod environment deploy') {
            when {
                branch 'master'
            }
            input('Proceed to production?')
            agent {
                label "jenkins-terraform"
            }
            steps {
                container('terraform') {
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'AWS-SVC-Jenkins-prod-dev' ]]) {
                        sh """
                        cd infrastructure
                        terraform init -input=false -no-color -force-copy -reconfigure -backend-config="bucket=slackbots-prod-tfstates"
                        terraform plan -out=plan_prod_gratibot -input=false -no-color -var app_image=docker.io/${IMAGE}:${GIT_COMMIT[0..10]} -var domain='prod.liatr.io' -var app_host='gratibot'
                        terraform apply -input=false plan_prod_gratibot -no-color
                        """
                    }
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
