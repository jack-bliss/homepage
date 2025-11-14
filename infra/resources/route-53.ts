import {
  aws_route53 as route53,
  aws_route53_targets as route53Targets,
} from 'aws-cdk-lib';

import { Construct } from 'constructs';
import { IDistribution } from 'aws-cdk-lib/aws-cloudfront';
import { MxRecordValue } from 'aws-cdk-lib/aws-route53';

export const createARecord = ({
  scope,
  id,
  hostedZoneId,
  zoneName,
  recordName,
  distribution,
}: {
  scope: Construct;
  id: string;
  hostedZoneId: string;
  zoneName: string;
  recordName: string;
  distribution: IDistribution;
}) => {
  return {
    aRecord: new route53.ARecord(scope, `${id}_ARecord`, {
      zone: route53.HostedZone.fromHostedZoneAttributes(
        scope,
        `${id}_HostedZoneReference`,
        {
          hostedZoneId,
          zoneName,
        },
      ),
      recordName,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(distribution),
      ),
    }),
  };
};

export const createMxRecord = ({
  scope,
  id,
  hostedZoneId,
  zoneName,
  recordName,
  values,
}: {
  scope: Construct;
  id: string;
  hostedZoneId: string;
  zoneName: string;
  recordName: string;
  values: MxRecordValue[];
}) => {
  return {
    mxRecord: new route53.MxRecord(scope, `${id}_MXRecord`, {
      zone: route53.HostedZone.fromHostedZoneAttributes(
        scope,
        `${id}_HostedZoneReference`,
        {
          hostedZoneId,
          zoneName,
        },
      ),
      recordName,
      values,
    }),
  };
};
