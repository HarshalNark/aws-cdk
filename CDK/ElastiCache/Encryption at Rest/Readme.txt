# --------------------------------------
ElastCache Customer Managed CMK Encryption 
(Encryption at Rest)
# --------------------------------------

→ CfnReplicationGroup, atRestEncryptionEnabled & kmsKeyId AWS Documentation Reference: 
  https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-elasticache.CfnReplicationGroup.html


## AWS CDK version 1.193.0

1. Update Node.js
nvm install lts/*

2. Install AWS CDK:
npm install -g aws-cdk

3. Update the AWS CDK CLI to the latest version
npm i -g aws-cdk --force

4. Create CDK app:
mkdir cdk-project && cd cdk-project
cdk init sample-app --language typescript

5. Deploy a 'CDKToolkit' CloudFormation Stack:
cdk bootstrap

6. Synthesize an AWS CloudFormation template:
cdk synth > <Your-Generated-CloudFormation-Template-Name>.yaml

7. Deploy the Stack using generated AWS CloudFormation template from previous step:
cdk deploy

8. Destroy the CDK App's resources to avoid incurring costs:
cdk destroy

## Note: 
Manually DELETE the provisioned AWS resources to avoid incurring costs, if necessary.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
