// Import necessary packages
// import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Construct } from 'constructs';

// Creates export for application class to call on for construct creation
export class CdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    // Creates Customer managed CMK key (Construct)
    const key = new kms.Key(this, 'my-dynamodb-cmk-key', {
      
      // Specify what should happen to the key when the stack is deleted. By default, the key is retained in an orphaned state
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      
      // The number of days (7 - 30) before the KMS key gets deleted. By default the waiting period is 30 days
      pendingWindow: cdk.Duration.days(7),
      
      // An alias to add to the KMS key. The alias can then be used for different operations, i.e. to import the KMS key in a different stack
      alias: 'alias/mydynamodbcmkkey',
      
      // A short description of how the KMS key is intended to be used
      description: 'Customer managed CMK key for encrypting the objects in DynamoDB table',
      
      // Whether AWS should rotate the KMS key for us
      enableKeyRotation: false,
    });

    // Creates CMK encrypted DynamoDB Table (Construct)
    const dynamodbtableencrypted = new dynamodb.Table(this, 'MySSECMKDynamoDBTable', {
      
      // Specify what should happen to the table when the stack gets deleted. 
      removalPolicy: cdk.RemovalPolicy.DESTROY,

      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },

      // Encryption configuration: Server-side encryption with a KMS key managed by the customer
      encryption: dynamodb.TableEncryption.CUSTOMER_MANAGED,
      encryptionKey: key,
    });
    
    // Creates CloudFormation Outputs to identify the resources after stack gets deployed
    new cdk.CfnOutput(this, 'key-arn', {
      value: key.keyArn,
      description: 'Customer managed CMK key ARN for encrypting the objects in DynamoDB table',
    });

    new cdk.CfnOutput(this, 'dynamodb-table-name', {
      value: dynamodbtableencrypted.tableName,
      description: 'Customer managed CMK encrypted DynamoDB Table Name',
    });
  }
}


