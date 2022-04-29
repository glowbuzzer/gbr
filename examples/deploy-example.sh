#!/usr/bin/env bash

aws s3 sync --delete ./dist/examples/$1 "s3://$2/examples/$1" && \
aws cloudfront create-invalidation --paths "/*" --distribution-id $3
