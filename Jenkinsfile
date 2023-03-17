pipeline {
    agent any
    tools { nodejs "NodeJS" }
    stages {
        stage('Build') { 
            steps {
                sh 'npm install --omit=dev' 
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Build and push docker image'){
            steps {
                withDockerRegistry(credentialsId: 'docker-hub', url: 'https://index.docker.io/v1/') {
                    sh 'docker build -t khacbaocsek19/chat-app:v3 .'
                    sh 'docker push khacbaocsek19/chat-app:v3'
                }
            }
        }
        stage('Continuous deployment in k8s'){
            steps{
                sshagent(['main-root']) {
                    // some block
                    sh 'kubectl set image deployment/chat-app-backend chat-app-backend=khacbaocsek19/chat-app:v3'
                }
            }
        }
    }
}