import {
  Duration,
  aws_cloudfront as cloudfront,
  aws_certificatemanager as certificatemanager,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export const createDistribution = ({
  context,
  id,
  domainName,
  certificateArn,
  aliases,
  origin,
}: {
  context: Construct;
  id: string;
  domainName: string;
  certificateArn: string;
  aliases: string[];
  origin: cloudfront.IOrigin;
}) => {
  const distribution = new cloudfront.Distribution(
    context,
    `${id}_Cloudfront`,
    {
      comment: `${domainName} ${id} cache behaviour`,
      defaultBehavior: {
        origin,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: new cloudfront.CachePolicy(
          context,
          `${id}_CachePolicy`,
          {
            defaultTtl: Duration.seconds(10),
            minTtl: Duration.seconds(0),
            maxTtl: Duration.hours(1),
          },
        ),
      },
      domainNames: aliases,
      certificate: certificatemanager.Certificate.fromCertificateArn(
        context,
        `${id}_CloudFront_CertificateReference`,
        certificateArn,
      ),
    },
  );
  return { distribution };
};
