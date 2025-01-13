#!/usr/bin/env bash

set -euo pipefail

ENV=dev

# Fetch the IP Address of the frontend instance
FRONTEND_IP=$(aws ec2 describe-instances \
    --filters "Name=tag:Name,Values=simplelaw-$ENV-frontend" "Name=instance-state-name,Values=running" \
    --query "Reservations[*].Instances[*].PublicIpAddress" \
    --region ap-northeast-2 \
    --output text)

echo "Frontend IP: $FRONTEND_IP"

# Fetch the SSH Key of the frontend instance
SSH_KEY=$(aws ssm get-parameter \
    --name "/simplelaw/$ENV/ssh-private-key" \
    --with-decryption \
    --query "Parameter.Value" \
    --output text)

# echo "SSH Key: $SSH_KEY"

rm -f .ec2-ssh-private-key
echo "$SSH_KEY" > .ec2-ssh-private-key
chmod 0400 .ec2-ssh-private-key 

# Fetch the most recent image URI from ECR
IMAGE_URI="354918403169.dkr.ecr.ap-northeast-2.amazonaws.com/frontend"
REPO_NAME="frontend"
IMAGE_TAG=$(aws ecr describe-images \
    --repository-name $REPO_NAME \
    --query 'sort_by(imageDetails[?!(contains(imageTags, `cache`))], &imagePushedAt)[-1].imageTags[0]' \
    --output text)

echo "ECR URL: $IMAGE_URI:$IMAGE_TAG"


# ssh -i .ec2-ssh-private-key -o StrictHostKeyChecking=no ec2-user@$FRONTEND_IP
# aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 354918403169.dkr.ecr.ap-northeast-2.amazonaws.com
# docker run -d --name simplelaw-frontend -p 80:80 $IMAGE_URI:$IMAGE_TAG

# Deploy the frontend
ssh -T -i .ec2-ssh-private-key -o StrictHostKeyChecking=no ec2-user@$FRONTEND_IP << EOF
    set -x
    aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 354918403169.dkr.ecr.ap-northeast-2.amazonaws.com
    docker pull "$IMAGE_URI:$IMAGE_TAG"
    if [ \$(docker ps -q -f name=simplelaw-frontend) ]; then
        # docker stop simplelaw-frontend
        docker rm -f simplelaw-frontend
    fi
    docker run -d --name simplelaw-frontend -p 80:80 "$IMAGE_URI:$IMAGE_TAG"
EOF