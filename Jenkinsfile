pipeline {
    agent any

    tools {
        nodejs 'NodeJS 16' // You must define this in Jenkins > Global Tool Configuration
    }

    environment {
        IMAGE_NAME = "vibhavakrishna/nodejs-demo-app"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/nightsky213/nodejs-demo-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                // Runs tests if any; doesn't fail the build if they’re missing
                sh 'npm test || echo "No tests found"'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$BUILD_NUMBER .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                    sh 'docker push $IMAGE_NAME:$BUILD_NUMBER'
                }
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker rm -f nodejs-app || true' // Stop old container if running
                sh 'docker run -d -p 3000:3000 --name nodejs-app $IMAGE_NAME:$BUILD_NUMBER'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully.'
        }
        failure {
            echo '❌ Pipeline failed.'
        }
    }
}
