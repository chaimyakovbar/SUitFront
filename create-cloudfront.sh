#!/bin/bash

# Script to create CloudFront Distribution for S3 assets
# Make sure you have AWS CLI configured with proper credentials

echo "Creating CloudFront Distribution for ch-suits S3 bucket..."

# Create the CloudFront distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-distribution.json

echo "CloudFront Distribution creation initiated!"
echo "Note: It may take 10-15 minutes for the distribution to be fully deployed."
echo "You can check the status in the AWS Console or using:"
echo "aws cloudfront list-distributions"
