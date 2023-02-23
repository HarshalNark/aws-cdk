// RDS OLD Import necessary packages
// import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Construct } from 'constructs';

export class CdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creates Customer managed CMK key (Construct)
    const key = new kms.Key(this, 'my-rds-kms-cmk-key', {

      // Specify what should happen to the key when the stack is deleted. By default, the key is retained in an orphaned state
      removalPolicy: cdk.RemovalPolicy.DESTROY,

      // The number of days (7 - 30) before the KMS key gets deleted. By default the waiting period is 30 days
      pendingWindow: cdk.Duration.days(7),

      // An alias to add to the KMS key. The alias can then be used for different operations, i.e. to import the KMS key in a different stack
      alias: 'alias/myrdskmscmkkey',

      // A short description of how the KMS key is intended to be used
      description: 'Customer managed CMK key for encrypting RDS instance',

      // Whether AWS should rotate the KMS key for us
      enableKeyRotation: false,
    });


    // Create RDS instance (Construct)
    const dbInstance = new rds.DatabaseInstance(this, 'myCMKEncryptedRDSInstance', {

      // The policy that should be applied if the resource is deleted from the stack or replaced during an update.
      removalPolicy: cdk.RemovalPolicy.DESTROY,

      // The engine for the database. In this case - Postgres, version 13
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_13_7, }),

      // The class and size for the instance, in this case - t3.micro
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),

      // The VPC in which the DB subnet group will be created
      vpc: new ec2.Vpc(this, 'Myvpc'),

      // Indicates whether the RDS DB instance is encrypted.
      storageEncrypted: true,

      // The Customer managed CMK key that's used to encrypt the DB instance.
      storageEncryptionKey: key,
      
      // Whether the rds instance is a multi AZ deployment, in this case it's set to false, which is also the default value. 
      multiAz: false,

      // The credentials for the admin user of the database. 'fromGeneratedSecret' method has been used and passed it a username of 'postgres', the password will be auto generated and stored in secrets manager.
      credentials: rds.Credentials.fromGeneratedSecret('postgres'),

      // The allocated storage size of the database, in gigabytes. 
      allocatedStorage: 100,

      // The upper limit for storage auto scaling. 
      maxAllocatedStorage: 115,
      
      allowMajorVersionUpgrade: false,
      autoMinorVersionUpgrade: true,

      // For how many days automatic database snapshots should be kept. Atomated snapshots are turned off, by setting the value to 0 days. The default value is 1 day.
      backupRetention: cdk.Duration.days(0),

      // Specify whether automated backups should be deleted or retained when the rds instance is deleted
      deleteAutomatedBackups: true,

      // Specify whether the DB instance should have termination protection enabled.
      deletionProtection: false,

      // Specify the name of the database
      databaseName: 'mycmkencryptedrds',

      // Specify whether the rds instance should be publicly accessible.
      publiclyAccessible: false,

    });


    // Creates CloudFormation Outputs to identify the resources after stack gets deployed
    new cdk.CfnOutput(this, 'key-arn', {
      value: key.keyArn,
      description: 'Customer managed CMK key ARN for encrypting RDS',
    });

    new cdk.CfnOutput(this, 'dbEndpoint', {
      value: dbInstance.instanceEndpoint.hostname,
      description: 'Database endpoint',
    });

    new cdk.CfnOutput(this, 'secretName', {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      value: dbInstance.secret?.secretName!,
      description: 'The name of the secret that stores the password of the postgres user',
    });
  }
}
