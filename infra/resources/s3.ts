import { Duration, RemovalPolicy, aws_s3 as s3 } from 'aws-cdk-lib';

import { Construct } from 'constructs';

type CreateBucketProps = {
  scope: Construct;
  id: string;
  bucketName: string;
  versioned?: boolean;
};

export function createBucket({
  scope,
  id,
  bucketName,
  versioned = false,
}: CreateBucketProps) {
  const expireOldVersions: s3.LifecycleRule = {
    noncurrentVersionExpiration: Duration.days(30),
    noncurrentVersionsToRetain: 3,
  };
  const bucket = new s3.Bucket(scope, `${id}_Bucket`, {
    bucketName,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    enforceSSL: true,
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    lifecycleRules: [expireOldVersions],
    versioned: Boolean(versioned),
  });

  return {
    bucket,
  };
}
