Installation
-------------
Run "npm install" to install dependencies


AWS Setup
-------------
See `iam` folder for required IAM permissions


Serverless commands
-------------
First set AWS environment variables AWS_ACCESS_KEY_ID and AWS_SECRET_KEY.

Deploy all: $ ./serverless deploy [--stage prod]
Deploy one function: $ ./serverless deploy function -f [functionName] [--stage prod]
Invoke a remote function: $ ./serverless invoke -f [functionName] -l [--stage prod]
Display remote logs: $ ./serverless logs -f [functionName] -t [--stage prod]
Delete remote function: $ ./serverless remove
