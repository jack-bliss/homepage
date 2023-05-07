import {
  aws_s3 as s3,
  RemovalPolicy,
  aws_s3_deployment as s3_deployment,
} from 'aws-cdk-lib';
import { ISource } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export function createBucket({
  context,
  id,
  appDomainName,
  sources,
}: {
  context: Construct;
  id: string;
  appDomainName: string;
  sources: ISource[];
}) {
  const bucket = new s3.Bucket(context, `${id}_S3`, {
    bucketName: `${appDomainName}.assets`,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    enforceSSL: true,
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });

  const deployment = new s3_deployment.BucketDeployment(
    context,
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
