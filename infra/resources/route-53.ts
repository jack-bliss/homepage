import {
  aws_route53 as route53,
  aws_route53_targets as route53Targets,
} from 'aws-cdk-lib';
import { IDistribution } from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';

export const createARecord = ({
  context,
  id,
  hostedZoneId,
  zoneName,
  recordName,
  cloudFrontWebDistribution,
}: {
  context: Construct;
  id: string;
  hostedZoneId: string;
  zoneName: string;
  recordName: string;
  cloudFrontWebDistribution: IDistribution;
}) => {
  new route53.ARecord(context, `${id}_CDN_ARecord`, {
    zone: route53.HostedZone.fromHostedZoneAttributes(
      context,
      `${id}_R53_HostedZone`,
      {
        hostedZoneId,
        zoneName,
      },
    ),
    recordName,
    target: route53.RecordTarget.fromAlias(
      new route53Targets.CloudFrontTarget(cloudFrontWebDistribution),
    ),
  });
};
