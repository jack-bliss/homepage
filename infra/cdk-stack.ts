import { Fn, App, Stack, StackProps, aws_iam as iam } from 'aws-cdk-lib';
import { Source } from 'aws-cdk-lib/aws-s3-deployment';
import { join } from 'path';
import { createNodejsFunction } from './resources/lambda';
import { createDistribution } from './resources/cloudfront';
import { createARecord } from './resources/route-53';
import { createBucket } from './resources/s3';
import { projectNameToSubdomain } from './helpers/project-name-to-subdomain';

type RoutingProps = {
  certificateArn: string;
  domain: string;
  hostedZoneId: string;
};

export class CdkStack extends Stack {
  constructor(
    scope: App,
    id: string,
    routingProps: RoutingProps,
    props?: StackProps,
  ) {
    super(scope, id, props);

    // generate the target base URL for this app
    const appSubdomainName = projectNameToSubdomain(id);
    const appDomainName = `${appSubdomainName}.${routingProps.domain}`;

    // create storage bucket that can be read from and written to
    const { bucket } = createBucket({
      context: this,
      id,
      appDomainName,
      sources: [Source.asset('./bucket')],
    });

    // create actual lambda function that implements server (HttpService)
    const { functionUrl } = createNodejsFunction({
      context: this,
      id,
      entry: join(__dirname, '../src/server/lambda.ts'),
      bucket,
    });

    // get domainName required by cloudfront
    const functionApiUrl = Fn.select(1, Fn.split('://', functionUrl.url));
    const functionDomainName = Fn.select(0, Fn.split('/', functionApiUrl));

    // create cloudfront distribution
    const { cloudFrontWebDistribution } = createDistribution({
      context: this,
      id,
      domainName: functionDomainName,
      certificateArn: routingProps.certificateArn,
      aliases: [appDomainName],
    });

    // create a-record cloudfront distribution
    createARecord({
      context: this,
      id,
      hostedZoneId: routingProps.hostedZoneId,
      zoneName: routingProps.domain,
      recordName: appDomainName,
      cloudFrontWebDistribution,
    });
  }
}

/*
AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
AWS_DEFAULT_REGION: 'eu-west-2'
*/
