pipeline {
    agent {
        docker {
            image 'nikolaik/python-nodejs:latest'
            args '-p 3000:3000'
        }
    }

    stages {
        stage('Configuration') {
            steps {
               sh 'bash scripts/build-steps/1_configuration.sh'
            }
        }

        stage('Build - server') {
            steps {
               sh 'bash scripts/build-steps/2_build_server.sh'
            }
        }

        stage('Build - proxy') {
            steps {
               sh 'bash scripts/build-steps/3_build_proxy.sh'
            }
        }

        stage('Deploy - proxy') {
            steps {
               sh 'bash scripts/build-steps/4_deploy_proxy.sh'
            }
        }

        stage('Test - server') {
            steps {
               sh 'bash scripts/build-steps/5_test_server.sh'
            }
        }
    }
}
