#!/usr/bin/env bash

#
# Copyright (c) 2022. Glowbuzzer. All rights reserved
#
set example=`basename $1`
aws s3 sync --region eu-west-1 --delete ./examples/$1/dist "s3://$2/$example"
