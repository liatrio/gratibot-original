pipeline {
  agent none
  environment {
    SLACK_CHANNEL="flywheel"
  }
  stages {
    stage('Build') {
      agent {
        label "lead-toolchain-skaffold"
      }
      steps {
        container('skaffold') {
          sh "skaffold build --file-output=image.json"
          stash includes: 'image.json', name: 'build'
          sh "rm image.json"
        }
      }
    }
    stage('Deploy to Staging') {
      agent {
        label "lead-toolchain-skaffold"
      }
      when {
        beforeAgent true
        branch 'master'
      }
      environment {
        NAMESPACE      = "${env.stagingNamespace}"
        SLACK_AUTH_URL = "http://gratibot.${env.stagingDomain}/oauth"
      }
      steps {
        container('skaffold') {
          unstash 'build'
          sh "skaffold deploy -a image.json -n ${NAMESPACE}"
        }
        stageMessage "Successfully deployed to staging: `gratibot.${env.stagingDomain}`"
      }
    }
    stage ('Manual Ready Check') {
      agent none
      when {
        beforeInput true
        branch 'master'
      }
      options {
        timeout(time: 30, unit: 'MINUTES')
      }
      input {
        message 'Deploy to Production?'
      }
      steps {
        echo "Deploying"
      }
    }
    stage('Deploy to Production') {
      when {
        beforeAgent true
        branch 'master'
      }
      agent {
        label "lead-toolchain-skaffold"
      }
      environment {
        NAMESPACE      = "${env.productionNamespace}"
        SLACK_AUTH_URL = "http://gratibot.${env.productionDomain}/oauth"
      }
      steps {
        container('skaffold') {
          unstash 'build'
          sh "skaffold deploy -a image.json -n ${NAMESPACE}"
        }
        stageMessage "Successfully deployed to production: `gratibot.${env.productionDomain}`"
      }
    }
  }
}
