import { Construct } from 'constructs';
import { createARecord } from '../resources/route-53';
import { createBucket } from '../resources/s3';
import { createDistribution } from '../resources/cloudfront';
import { aws_cloudfront_origins as origins } from 'aws-cdk-lib';

export function cloudfrontWebsite({
  scope,
  id,
  appDomainName,
  stackName,
  certificateArn,
  hostedZoneId,
  domain,
}: {
  scope: Construct;
  id: string;
  appDomainName: string;
  stackName: string;
  certificateArn: string;
  hostedZoneId: string;
  domain: string;
}) {
  const { bucket } = createBucket({
    scope,
    id,
    bucketName: `${appDomainName}.assets`,
    versioned: true,
  });

  const { distribution } = createDistribution({
    scope,
    id,
    origin: new origins.S3Origin(bucket, {
      originPath: stackName,
    }),
    certificateArn,
    aliases: [appDomainName, `www.${appDomainName}`],
    stackName,
    defaultRootObject: 'index.html',
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
