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
}: {
  context: Construct;
  id: string;
  domainName: string;
  certificateArn: string;
  aliases: string[];
}) => {
  const cloudFrontWebDistribution =
    new cloudfront.CloudFrontWebDistribution(context, `${id}_CloudFront`, {
      comment: `${id}HttpService cache behaviour`,
      defaultRootObject: '',
      viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
        certificatemanager.Certificate.fromCertificateArn(
          context,
          `${id}_certificate`,
          certificateArn,
        ),
        {
          aliases,
        },
      ),
      originConfigs: [
        {
          customOriginSource: {
            domainName,
            originProtocolPolicy:
              cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
              forwardedValues: {
                queryString: true,
                cookies: {
                  forward: 'all',
                },
                headers: [
                  'Accept',
                  'Accept-Charset',
                  'Accept-Language',
                  'Accept-Encoding',
                  'Authorization',
                  'Origin',
                  'Referrer',
                  'Access-Control-Request-Method',
                  'Access-Control-Request-Headers',
                ],
              },
              defaultTtl: Duration.seconds(10),
              minTtl: Duration.seconds(0),
              maxTtl: Duration.hours(1),
              functionAssociations: [],
            },
          ],
        },
      ],
    });
  return { cloudFrontWebDistribution };
};
