import {
  Duration,
  aws_lambda_nodejs as lambda_nodejs,
  aws_lambda,
  aws_s3 as s3,
  aws_iam as iam,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export const createNodejsFunction = ({
  context,
  id,
  entry,
  bucket,
}: {
  context: Construct;
  id: string;
  entry: string;
  bucket: s3.Bucket;
}) => {
  const nodejsFunction = new lambda_nodejs.NodejsFunction(
    context,
    `${id}_Lambda`,
    {
      functionName: `${id}HttpService`,
      handler: 'handler',
      entry,
      memorySize: 1024,
      runtime: aws_lambda.Runtime.NODEJS_18_X,
      logRetention: 14,
      timeout: Duration.seconds(300),
      bundling: {
        minify: true,
        externalModules: ['aws-sdk'],
        loader: {
          '.html': 'text',
        },
      },
      environment: {
        NODE_ENV: 'production',
        BUCKET: bucket.bucketName,
      },
    },
  );

  // give it a URL
  const functionUrl = nodejsFunction.addFunctionUrl({
    authType: aws_lambda.FunctionUrlAuthType.NONE,
  });

  // give it access to the bucket
  nodejsFunction.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ['s3:GetObject', 's3:PutObject'],
      resources: [`${bucket.bucketArn}/*`],
    }),
  );
  nodejsFunction.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ['s3:ListBucket'],
      resources: [bucket.bucketArn],
    }),
  );

  return {
    nodejsFunction,
    functionUrl,
  };
};
