pipeline {
    agent none
    environment {
        SKAFFOLD_DEFAULT_REPO = 'docker.artifactory.liatr.io/liatrio'
        SLACK_CHANNEL="flywheel"
        TF_INPUT              = 0
        TF_IN_AUTOMATION      = 1 
        TF_CLI_ARGS           = "-no-color"
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
                beforeAgent true
                branch 'master'
            }
            agent {
                label "lead-toolchain-terraform"
            }
            environment {
                TF_VAR_app_image      = "${SKAFFOLD_DEFAULT_REPO}/${IMAGE}:${GIT_COMMIT[0..7]}"
                TF_VAR_domain         = "liatr.io"
                TF_VAR_app_host       = "dev.gratibot"
            }
            steps {
                container('terraform') {
                    dir('infrastructure') {
                        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'AWS-SVC-Jenkins-non-prod-dev' ]]) {
                            sh "terraform init -force-copy -reconfigure"
                            sh "terraform apply -auto-approve"
                        }
                    }
                }
                slackSend channel: "#${env.SLACK_CHANNEL}", message: "Promote gratibot: (<${env.BUILD_URL}|Go to job to approve/deny>)"
            }
        }
        stage('Prod Deploy') {
            when {
                beforeAgent true
                branch 'master'
            }
            agent {
                label "lead-toolchain-terraform"
            }
            environment {
                TF_VAR_app_image      = "${SKAFFOLD_DEFAULT_REPO}/${IMAGE}:${GIT_COMMIT[0..7]}"
                TF_VAR_domain         = "prod.liatr.io"
                TF_VAR_app_host       = "gratibot"
            }
            steps {
                input('Proceed to production?')
                container('terraform') {
                    dir('infrastructure') {
                        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'AWS-SVC-Jenkins-prod-dev' ]]) {
                            sh "terraform init -force-copy -reconfigure -backend-config='bucket=slackbots-prod-tfstates'"
                            sh "terraform apply -auto-approve"
                        }
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
