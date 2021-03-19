#!/usr/bin/env bash

mkdir -p ~/.aws
cat > ~/.aws/credentials << EOF
[gb-deploy]
aws_access_key_id=$AWS_ACCESS_KEY_ID
aws_secret_access_key=$AWS_SECRET_ACCESS_KEY
EOF

export AWS_PROFILE=gb-deploy

aws s3 sync --quiet ./apps/glowsite/public "s3://$1/site" && \
aws cloudfront create-invalidation --paths "/site/*" --distribution-id $2
