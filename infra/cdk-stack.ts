import {
  Fn,
  App,
  Stack,
  StackProps,
  CfnOutput,
  aws_cloudfront,
  aws_cloudfront_origins,
} from 'aws-cdk-lib';
import { Source } from 'aws-cdk-lib/aws-s3-deployment';
import { join } from 'path';
import { createNodejsFunction } from './resources/lambda';
import { createDistribution } from './resources/cloudfront';
import { createARecord } from './resources/route-53';
import { createBucket } from './resources/s3';

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
    // targets base domain
    const appDomainName = routingProps.domain;

    // create storage bucket that can be read from and written to
    const { bucket } = createBucket({
      context: this,
      id,
      appDomainName,
      sources: [Source.asset('./bucket')],
    });

    // create actual lambda function that implements server (HttpService)
    const { nodejsFunction, functionUrl } = createNodejsFunction({
      context: this,
      id,
      entry: join(__dirname, '../src/server/lambda.ts'),
      bucket,
    });

    // get domainName required by cloudfront
    const functionApiUrl = Fn.select(1, Fn.split('://', functionUrl.url));
    const functionDomainName = Fn.select(0, Fn.split('/', functionApiUrl));

    // create cloudfront distribution
    const { distribution } = createDistribution({
      context: this,
      id,
      domainName: functionDomainName,
      certificateArn: routingProps.certificateArn,
      aliases: [appDomainName],
      origin: new aws_cloudfront_origins.HttpOrigin(functionDomainName),
    });

    // create a-record cloudfront distribution
    createARecord({
      context: this,
      id,
      hostedZoneId: routingProps.hostedZoneId,
      zoneName: routingProps.domain,
      recordName: appDomainName,
      distribution,
    });

    new CfnOutput(this, `CloudFrontDistribution`, {
      value: distribution.distributionId,
    });

    new CfnOutput(this, `LambdaFunctionUrl`, {
      value: functionUrl.url,
    });
    new CfnOutput(this, `LambdaLogGroupUrl`, {
      value: `https://eu-west-2.console.aws.amazon.com/cloudwatch/home?region=eu-west-2#logsV2:log-groups/log-group/$252Faws$252Flambda$252F${nodejsFunction.functionName}`,
    });
    new CfnOutput(this, `AssetsBucketName`, { value: bucket.bucketName });
    new CfnOutput(this, `PublicUrl`, {
      value: `https://${appDomainName}`,
    });
  }
}

/*
AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
AWS_DEFAULT_REGION: 'eu-west-2'
*/
