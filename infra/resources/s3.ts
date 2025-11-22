import {
  Duration,
  RemovalPolicy,
  aws_kms as kms,
  aws_s3 as s3,
  aws_s3_deployment as s3_deployment,
} from 'aws-cdk-lib';

import { Construct } from 'constructs';

type CreateBucketProps = {
  scope: Construct;
  id: string;
  bucketName: string;
  versioned?: boolean;
  sources?: s3_deployment.ISource[];
};

export function createBucket({
  scope,
  id,
  bucketName,
  versioned = false,
  sources = [],
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

  const deployment = new s3_deployment.BucketDeployment(
    scope,
    `${id}_BucketDeployment`,
    {
      destinationBucket: bucket,
      sources,
      prune: false,
    },
  );

  return {
    bucket,
    deployment,
  };
}
