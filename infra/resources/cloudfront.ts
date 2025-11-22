import {
  Duration,
  aws_certificatemanager as certificatemanager,
  aws_cloudfront as cloudfront,
} from 'aws-cdk-lib';

import { Construct } from 'constructs';

export const createDistribution = ({
  scope,
  id,
  origin,
  certificateArn,
  aliases,
  stackName,
  defaultRootObject = 'index.html',
  edgeLambdas = [],
}: {
  scope: Construct;
  id: string;
  certificateArn: string;
  aliases: string[];
  origin: cloudfront.IOrigin;
  stackName: string;
  defaultRootObject?: string;
  edgeLambdas?: cloudfront.EdgeLambda[];
}) => {
  const distribution = new cloudfront.Distribution(
    scope,
    `${id}_Cloudfront`,
    {
      comment: `
${stackName} ${id} cache behaviour, 
uses certificate with arn ${certificateArn}, 
has aliases [${aliases.join(', ')}]
`,
      defaultRootObject,
      defaultBehavior: {
        origin,
        edgeLambdas,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: new cloudfront.CachePolicy(
          scope,
          `${id}_CachePolicy`,
          {
            defaultTtl: Duration.seconds(10),
            minTtl: Duration.seconds(0),
            maxTtl: Duration.minutes(1),
          },
        ),
      },
      domainNames: aliases,
      certificate: certificatemanager.Certificate.fromCertificateArn(
        scope,
        `${id}_CloudFront_CertificateReference`,
        certificateArn,
      ),
    },
  );
  return { distribution };
};
