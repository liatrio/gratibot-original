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
        TILLER_NAMESPACE      = "${env.stagingNamespace}"
        ISTIO_DOMAIN          = "${env.stagingDomain}"
      }
      steps {
        container('skaffold') {
          unstash 'build'
          sh "skaffold deploy -a image.json -n ${TILLER_NAMESPACE}"
        }
        stageMessage "Successfully deployed to staging:\ngratibot.${env.stagingDomain}"
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
        TILLER_NAMESPACE = "${env.productionNamespace}"
        ISTIO_DOMAIN   = "${env.productionDomain}"
      }
      steps {
        container('skaffold') {
          unstash 'build'
          sh "skaffold deploy -a image.json -n ${TILLER_NAMESPACE}"
        }
        stageMessage "Successfully deployed to production:\ngratibot.${env.productionNamespace}/"
      }
    }
  }
}
