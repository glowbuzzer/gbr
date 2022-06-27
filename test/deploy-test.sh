#!/usr/bin/env bash

#
# Copyright (c) 2022. Glowbuzzer. All rights reserved
#

aws s3 cp ./test.js "s3://$1/gbr/test.js" && \
aws cloudfront create-invalidation --paths "/*" --distribution-id $2
