// Import necessary packages
// import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Construct } from 'constructs';

// Creates export for application class to call on for construct creation
export class CdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    // Creates Customer managed CMK key (Construct)
    const key = new kms.Key(this, 'my-s3-kms-cmk-key', {
      
      // Specify what should happen to the key when the stack is deleted. By default, the key is retained in an orphaned state
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      
      // The number of days (7 - 30) before the KMS key gets deleted. By default the waiting period is 30 days
      pendingWindow: cdk.Duration.days(7),
      
      // An alias to add to the KMS key. The alias can then be used for different operations, i.e. to import the KMS key in a different stack
      alias: 'alias/mys3kmscmkkey',
      
      // A short description of how the KMS key is intended to be used
      description: 'Customer managed CMK key for encrypting the objects in the S3 bucket',
      
      // Whether AWS should rotate the KMS key for us
      enableKeyRotation: false,
    });

    // Creates CMK encrypted S3 bucket (Construct)
    const s3Bucket = new s3.Bucket(this, 'MyCMKEncryptedBucket', {
      
      // Specify what should happen to the bucket when the stack gets deleted. 
      removalPolicy: cdk.RemovalPolicy.DESTROY,

      // Encryption configuration: Server-side encryption with a KMS key managed by the customer
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: key,
    });

    
    // Creates CloudFormation Outputs to identify the resources after stack gets deployed
    new cdk.CfnOutput(this, 'key-arn', {
      value: key.keyArn,
      description: 'Customer managed CMK key ARN for encrypting the objects in the S3 bucket',
    });

    new cdk.CfnOutput(this, 'bucket-name', {
      value: s3Bucket.bucketName,
      description: 'S3 Bucket Name encrypted with Customer managed CMK',
    });
  }
}


