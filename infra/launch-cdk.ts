#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { CdkStack } from './cdk-stack';
import {
  CERTIFICATE_ARN,
  DOMAIN,
  HOSTED_ZONE_ID,
  PROJECT_NAME,
} from './app';
import { join } from 'path';

const app = new App();

new CdkStack(
  app,
  PROJECT_NAME,
  {
    hostedZoneId: HOSTED_ZONE_ID,
    certificateArn: CERTIFICATE_ARN,
    domain: DOMAIN,
  },
  {
    description: '',
    env: {
      region: 'eu-west-2',
    },
  },
);
