#!/usr/bin/env bash

#
# Copyright (c) 2022. Glowbuzzer. All rights reserved
#

aws s3 sync --region eu-west-1 --delete ./examples/$1/dist "s3://$2/examples/$1" && \
aws cloudfront create-invalidation --region eu-west-1 --paths "/*" --distribution-id $3
