// Import necessary packages
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

// Creates export for application class to call on for construct creation
export class CdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creates S3 bucket (Construct)
    const s3Bucket = new s3.Bucket(this, 'MySSLEnforcedBucket', {
      
      // Specify what should happen to the bucket when the stack gets deleted. 
      removalPolicy: cdk.RemovalPolicy.DESTROY,

      // Enforces SSL for requests.
      enforceSSL: true,
    });
    
    // Creates CloudFormation Outputs to identify the resources after stack gets deployed
    new cdk.CfnOutput(this, 'bucket-name', {
      value: s3Bucket.bucketName,
      description: 'S3 Bucket Name',
    });
  }
}
