import { createARecord } from '../resources/route-53';
import { createBucket } from '../resources/s3';
import { createDistribution } from '../resources/cloudfront';
import {
  Stack,
  aws_cloudfront_origins as origins,
  aws_s3_deployment as s3_deployment,
  aws_cloudfront as cloudfront,
} from 'aws-cdk-lib';

type CloudfrontWebsiteConfig = {
  scope: Stack;
  id: string;
  appDomainName: string;
  stackName: string;
  certificateArn: string;
  hostedZoneId: string;
  domain: string;
  sources: s3_deployment.ISource[];
  edgeLambdas?: cloudfront.EdgeLambda[];
};

export function cloudfrontWebsite({
  scope,
  id,
  appDomainName,
  stackName,
  certificateArn,
  hostedZoneId,
  domain,
  edgeLambdas,
  sources,
}: CloudfrontWebsiteConfig) {
  const { bucket } = createBucket({
    scope,
    id,
    bucketName: `${appDomainName}.assets`,
    versioned: true,
    sources,
  });

  const { distribution } = createDistribution({
    scope,
    id,
    origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
    certificateArn,
    aliases: [appDomainName, `www.${appDomainName}`],
    stackName,
    defaultRootObject: 'index.html',
    edgeLambdas,
  });

  const { aRecord: wwwARecord } = createARecord({
    scope,
    id: `${id}_www`,
    hostedZoneId,
    zoneName: domain,
    recordName: `www.${appDomainName}`,
    distribution,
  });

  const { aRecord: baseARecord } = createARecord({
    scope,
    id,
    hostedZoneId,
    zoneName: domain,
    recordName: appDomainName,
    distribution,
  });

  return {
    bucket,
    distribution,
    wwwARecord,
    baseARecord,
  };
}
