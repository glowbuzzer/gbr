#!/usr/bin/env bash

#
# Copyright (c) 2022. Glowbuzzer. All rights reserved
#

aws s3 sync --region eu-west-1 --delete ./dist/examples/$1 "s3://$2/examples/$1" && \
aws cloudfront create-invalidation --region eu-west-1 --paths "/*" --distribution-id $3
