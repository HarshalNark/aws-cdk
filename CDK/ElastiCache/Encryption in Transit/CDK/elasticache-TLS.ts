
// Import necessary packages
import * as cdk from 'aws-cdk-lib';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Construct } from 'constructs';

export class CdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    // Creates ElastiCache CacheCluster (Construct)
    const elasticachecfnCacheCluster = new elasticache.CfnCacheCluster(this, 'MyElastiCacheCacheCluster', {
      
      // Enable encryption in transit on CacheCluster
      transitEncryptionEnabled: true,
       
      
      engine: "Redis",
      engineVersion: '6.x',
      clusterName: 'RedisCacheCluster-Encrypt-in-Transit',
      cacheNodeType: 'cache.t3.micro',
      numCacheNodes: 1, 

    });
    
    // Creates ElastiCache Replication Group (Construct)
    const elasticachecfnReplicationGroup = new elasticache.CfnReplicationGroup(this, 'MyElastiCacheCfnReplicationGroup', {
      
      // Enable encryption in transit on a replication group
      transitEncryptionEnabled: true,
       
      
      engine: "Redis",
      engineVersion: '6.x',
      numNodeGroups: 1,
      numCacheClusters: 1,
      automaticFailoverEnabled: false,
      autoMinorVersionUpgrade: false,
      replicationGroupDescription: 'RedisReplicationGroup-Encrypt-in-Transit',

    });
  }
}