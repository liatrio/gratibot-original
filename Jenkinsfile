pipeline {
    environment {
        SKAFFOLD_DEFAULT_REPO = 'docker.artifactory.liatr.io/liatrio'
        SLACK_CHANNEL="flywheel"
    }
    stages {
        stage('Build Image') {
            agent {
                label "lead-toolchain-skaffold-node"
            }
            steps {
                container('skaffold') {
                    script {
                      docker.withRegistry("https://${SKAFFOLD_DEFAULT_REPO}", 'jenkins-credential-artifactory') {
                          sh "skaffold build"
                      }
                    }
                }
            }
        }
        stage('Preprod Deploy') {
            when {
                branch 'master'
            }
            agent {
                label "lead-toolchain-terraform"
            }
            steps {
                container('terraform') {
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'AWS-SVC-Jenkins-non-prod-dev' ]]) {
                        sh """
                        cd infrastructure
                        terraform init -input=false -no-color -force-copy -reconfigure
                        terraform plan -out=plan_nonprod_gratibot -input=false -no-color -var app_image=${SKAFFOLD_DEFAULT_REPO}/${IMAGE}:${GIT_COMMIT[0..7]} -var domain='liatr.io' -var app_host='dev.gratibot'
                        terraform apply -input=false plan_nonprod_gratibot -no-color
                        """
                    }
                }
                slackSend channel: "#${env.SLACK_CHANNEL}", message: "Promote gratibot: (<${env.BUILD_URL}|Go to job to approve/deny>)"
            }
        }
        stage('Prod Deploy') {
            when {
                branch 'master'
            }
            agent {
                label "lead-toolchain-terraform"
            }
            steps {
                input('Proceed to production?')
                container('terraform') {
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'AWS-SVC-Jenkins-prod-dev' ]]) {
                        sh """
                        cd infrastructure
                        terraform init -input=false -no-color -force-copy -reconfigure -backend-config="bucket=slackbots-prod-tfstates"
                        terraform plan -out=plan_prod_gratibot -input=false -no-color -var app_image=${SKAFFOLD_DEFAULT_REPO}/${IMAGE}:${GIT_COMMIT[0..7]} -var domain='prod.liatr.io' -var app_host='gratibot'
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
