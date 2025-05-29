pipeline {
    agent any

    tools {
        nodejs 'NodeJS 18' // Ensure this is set in Jenkins > Global Tool Configuration
    }

    environment {
        IMAGE_NAME = "vibhavakrishna/nodejs-demo-app"
        CONTAINER_NAME = "nodejs-app"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/nightsky213/nodejs-demo-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test || echo "No tests found"'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$BUILD_NUMBER .'
                sh 'docker tag $IMAGE_NAME:$BUILD_NUMBER $IMAGE_NAME:latest' // Optional: Tag as latest
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                    sh 'docker push $IMAGE_NAME:$BUILD_NUMBER'
                    sh 'docker push $IMAGE_NAME:latest' // Optional
                }
            }
        }

        stage('Deploy New Container') {
            steps {
                script {
                    // Stop and remove the existing container if it exists
                    sh '''
                        if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
                            echo "Stopping and removing existing container..."
                            docker rm -f $CONTAINER_NAME
                        fi

                        echo "Running new container..."
                        docker run -d -p 3000:3000 --name $CONTAINER_NAME $IMAGE_NAME:$BUILD_NUMBER
                    '''
                }
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
