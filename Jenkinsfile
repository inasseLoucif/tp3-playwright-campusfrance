// TP4 - Chaîne d'intégration continue Jenkins pour les tests Playwright
// Fonctionne sur un Jenkins Windows (bat) comme Linux (sh).
pipeline {
    agent any

    parameters {
        choice(name: 'PARCOURS', choices: ['tp4', 'tp4-etudiant', 'tp4-chercheur', 'tous'],
               description: 'tp4 = les deux parcours du TP4 ; tous = TP3 + TP4')
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Récupération du code') {
            steps {
                checkout scm
            }
        }

        stage('Installation') {
            steps {
                script {
                    executer('node --version')
                    executer('npm ci')
                    executer('npx playwright install chromium')
                }
            }
        }

        stage('Tests Playwright') {
            steps {
                script {
                    def filtre = params.PARCOURS == 'tous' ? '' : "--grep @${params.PARCOURS}"
                    def code = executerAvecStatut("npx playwright test ${filtre}")
                    if (code != 0) {
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'output/junit.xml'
            archiveArtifacts artifacts: 'output/**', allowEmptyArchive: true
        }
    }
}

def executer(String commande) {
    if (isUnix()) { sh commande } else { bat commande }
}

def executerAvecStatut(String commande) {
    return isUnix() ? sh(script: commande, returnStatus: true)
                    : bat(script: commande, returnStatus: true)
}