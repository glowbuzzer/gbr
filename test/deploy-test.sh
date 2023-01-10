#!/usr/bin/env bash

#
# Copyright (c) 2022. Glowbuzzer. All rights reserved
#

aws s3 cp --region eu-west-1 ./test.js "s3://$1/gbr/test.js" && \
export AWS_MAX_ATTEMPTS=10 && \
aws cloudfront create-invalidation --region eu-west-1 --paths "/*" --distribution-id $2
