import {
  Fn,
  App,
  Stack,
  StackProps,
  CfnOutput,
  aws_cloudfront as cloudfront,
  aws_lambda as lambda,
} from 'aws-cdk-lib';
import { Source } from 'aws-cdk-lib/aws-s3-deployment';
import { join } from 'path';
import { cloudfrontWebsite } from './coordinated/cloudfront-website';

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

    const originRequest = new cloudfront.experimental.EdgeFunction(
      this,
      'OriginRequestLambda',
      {
        runtime: lambda.Runtime.NODEJS_24_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset(
          join(__dirname, '../src/html-replace-lambda'),
        ),
      },
    );

    const site = cloudfrontWebsite({
      scope: this,
      id,
      appDomainName,
      stackName: 'jackbliss_homepage',
      certificateArn: routingProps.certificateArn,
      hostedZoneId: routingProps.hostedZoneId,
      domain: routingProps.domain,
      sources: [Source.asset('./bucket')],
      edgeLambdas: [
        {
          functionVersion: originRequest.currentVersion,
          eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
          includeBody: false,
        },
      ],
    });

    new CfnOutput(this, `CloudFrontDistribution`, {
      value: site.distribution.distributionId,
    });
    new CfnOutput(this, `AssetsBucketName`, {
      value: site.bucket.bucketName,
    });
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
