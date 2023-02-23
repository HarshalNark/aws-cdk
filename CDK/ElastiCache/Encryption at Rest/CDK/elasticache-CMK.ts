
// import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Construct } from 'constructs';

export class CdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creates Customer managed CMK key (Construct)
    const key = new kms.Key(this, 'my-elasticache-kms-cmk-key', {

      // Specify what should happen to the key when the stack is deleted. By default, the key is retained in an orphaned state
      removalPolicy: cdk.RemovalPolicy.DESTROY,

      // The number of days (7 - 30) before the KMS key gets deleted. By default the waiting period is 30 days
      pendingWindow: cdk.Duration.days(7),

      // An alias to add to the KMS key. The alias can then be used for different operations, i.e. to import the KMS key in a different stack
      alias: 'alias/myelasticachekmscmkkey',

      // A short description of how the KMS key is intended to be used
      description: 'Customer managed CMK key for encrypting ElastiCache',

      // Whether AWS should rotate the KMS key for us
      enableKeyRotation: false,
    });


    // Creates CMK encrypted ElastiCache (Construct)
    const elasticachecfnReplicationGroup = new elasticache.CfnReplicationGroup(this, 'MyElastiCacheCfnReplicationGroup', {
      
     // Enable encryption at rest on a replication group
      atRestEncryptionEnabled: true,
       
      // The Customer managed CMK key ID that's used to encrypt the ElastiCache
      kmsKeyId: key.keyId,
      
      engine: "Redis",
      engineVersion: '6.x',
      
      numNodeGroups: 1,
      numCacheClusters: 1,
      automaticFailoverEnabled: false,
      autoMinorVersionUpgrade: false,
      replicationGroupDescription: 'RedisReplicationGroup-Encrypt-at-Rest',

    });

    // Creates CloudFormation Outputs to identify the resources after stack gets deployed
    new cdk.CfnOutput(this, 'key-arn', {
      value: key.keyArn,
      description: 'Customer managed CMK key ARN for encrypting ElastCache',
    });
  }
}
