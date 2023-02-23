
// import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as redshift from 'aws-cdk-lib/aws-redshift';
import { Construct } from 'constructs';

export class CdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creates ElastiCache CacheCluster (Construct)
    const encryptedredshiftcluster = new redshift.CfnClusterParameterGroup(this, 'MyRedshiftCfnClusterParameterGroup', {
      // Enable encryption-in-transit on Redshift by using Cluster Parameters
      parameters: [{
        parameterName: 'require_ssl',
        parameterValue: 'true',
      }],

      description: 'Redshift Cluster Parameter Group to enforce Encryption-in-Transit',
      parameterGroupFamily: 'redshift-1.0',

    });
  }
}
