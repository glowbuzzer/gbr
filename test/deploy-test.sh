#!/usr/bin/env bash

aws s3 sync ./test.js "s3://$1/gbr/test.js" && \
aws cloudfront create-invalidation --paths "/*" --distribution-id $2
