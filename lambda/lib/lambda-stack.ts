import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';
import 'dotenv/config';

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    console.log('Deploying with key',process.env.OPENAI_API_KEY);

    // Create the Lambda function
    const lambdaFunction = new NodejsFunction(this, 'TypeScriptLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: 'src/lambda/handler.ts',
      handler: 'handler',
      memorySize: 128,
      timeout: cdk.Duration.seconds(30),
      environment: { OPENAI_API_KEY: process.env.OPENAI_API_KEY as string },
    });

    // Create an IAM role for API Gateway logging
    const apiGatewayLoggingRole = new iam.Role(this, 'ApiGatewayLoggingRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });

    // Grant permissions to write logs to CloudWatch
    apiGatewayLoggingRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents', 'logs:DescribeLogStreams'],
        resources: ['arn:aws:logs:*:*:*'],
      }),
    );

    // Set the CloudWatch Logs role ARN in the account settings for API Gateway
    const apiGatewayAccount = new apigateway.CfnAccount(this, 'ApiGatewayAccount', {
      cloudWatchRoleArn: apiGatewayLoggingRole.roleArn,
    });

    // Create the API Gateway
    const api = new apigateway.RestApi(this, 'TypeScriptLambdaApi', {
      restApiName: 'TypeScript Lambda API',
      deployOptions: {
        accessLogDestination: new apigateway.LogGroupLogDestination(new cdk.aws_logs.LogGroup(this, 'ApiGatewayLogs')),
        accessLogFormat: apigateway.AccessLogFormat.clf(),
        stageName: 'prod',
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
      },
    });

    // Add a dependency on the custom resource to make sure the account settings are updated before the stage is created
    (api.node.defaultChild as apigateway.CfnRestApi).addDependsOn(apiGatewayAccount);

    // Enable CORS on the API Gateway
    api.root.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: apigateway.Cors.ALL_METHODS,
      allowHeaders: ['*'],
    });

    // Add a resource and a method to the API Gateway
    const lambdaResource = api.root.addResource('lambda');
    const lambdaIntegration = new apigateway.LambdaIntegration(lambdaFunction, {
      proxy: false,
      integrationResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': "'*'",
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,POST'",
          },
        },
        {
          statusCode: '405',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': "'*'",
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,POST'",
          },
        },
        {
          statusCode: '500',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': "'*'",
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,POST'",
          },
        },
      ],
    });;

    const methodOptions = {
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Allow-Origin': true,
          },
        },
        {
          statusCode: '405',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Allow-Origin': true,
          },
        },
        {
          statusCode: '500',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Allow-Origin': true,
          },
        },
      ],
    };

    const mockIntegration = new apigateway.MockIntegration({
      integrationResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-Token'",
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,POST'",
          },
        },
      ],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': '{"statusCode": 200}',
      },
    });

    lambdaResource.addMethod('OPTIONS', mockIntegration, methodOptions);
    lambdaResource.addMethod('POST', lambdaIntegration, methodOptions);

    // Output the API Gateway URL
    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url ?? '',
    });
  }
}