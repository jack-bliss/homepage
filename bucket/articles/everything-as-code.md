# Everything As Code

[[toc]]

The code we write never exists in a vacuum. It needs to be deployed, tested, and maintained. Each of these shares concern with the code, and following the principle of separation by concern, they should not be separated from the code. This means that they should be versioned, tested, and deployed alongside the code. We're already used to tests as code - it's hard to imagine a useful test suite that ISN'T code, but infrastructure and documentation are often overlooked.

![Neo sees the matrix](/articles/the-matrix.png)

## Infrastructure as code

One of the most common implementations of infrastructure as code is Docker, which encodes the environment configuration in a single, highly portable file that can launch code into a container. However, we can go a step further with tools like Terraform or CloudFormation, which allow us to define entire infrastructure stacks, including dockerised containers.

Terraform and CloudFormation both use declarative configuration files:

```terraform
data "archive_file" "zip" {
  type        = "zip"
  source_file = "source.js"
  output_path = "source.zip"
}

resource "aws_lambda_function" "lambda" {
  function_name     = "Hello world"
  filename          = data.archive_file.zip.output_path
  source_code_hash  = data.archive_file.zip.output_base64sha256
  role              = aws_iam_role.iam_for_lambda.arn
  handler           = "source.handler"
  runtime           = "python3.6"
}
```

However, CloudFormation also supports semi-imperative code through the AWS CDK:

```typescript
const nodejsFunction = new lambda_nodejs.NodejsFunction(
  context,
  `LambdaFunction`,
  {
    functionName: `MyService`,
    handler: 'handler',
    entry: './src/lambda.ts',
    memorySize: 1024,
    runtime: aws_lambda.Runtime.NODEJS_18_X,
    logRetention: 14, // days
    timeout: Duration.seconds(300),
    environment: {
      NODE_ENV: 'production',
      BUCKET: bucket.bucketName,
    },
  },
);
```

I refer to this code as "semi-imperative", beacuse it is still declarative in the sense that you are describing the desired outcome rather than taking the necessary steps to create it, but it is imperative in the sense that you are writing code that is executed to create the infrastructure. This is a powerful combination, because it unlocks the full power of TypeScript to create reusable, composable infrastructure.

The code that generates the infrastructure can share source code with the code that runs on it. The output of deploying the infrastructure can easily be used by the code that runs on it. The infrastructure is automatically versioned together with the code, and new environments can easily be created simply by creating a new branch and adjusting a few variables.

## Documentation as code

The hardest thing about code documentation is keeping it up to date. Code changes rapidly, especially during development, and the documentation you wrote yesterday can easily be out of date today. This is why auto-generated documentation is so powerful. It doesn't require any work to keep up to date - any changes you make will automatically be reflected in the documentation. There are limitations to this of course - not all documentation is captured by the parts that are easily auto-generated, but it's a good start. If you can integrated some manual documentation processes alongside your auto-generated documentation, you can get the best of both worlds.

A good example of this is [Swagger](https://swagger.io/). Swagger is a specification for documenting REST APIs. There are packages like [`swagger-autogen`](https://www.npmjs.com/package/swagger-autogen) that can be used to automatically generated documentation for your [`express`](https://www.npmjs.com/package/express) API. With some simple tagging, you can keep your documentation organised, and also add manual descriptions explaining the role of your endpoint:

```typescript
router.get('/users', async ({query: {page}}, res) => {
  // #swagger.summary = 'Allows fetching a page of users'
  const users = await userService.getPage(page);
  res.json(users);
});
```

Now your API is automatically documented, and an application is generated that you can deploy using your infrastructure-as-code setup.

This is just one form of static analysis. Another example is [`typedoc`](https://typedoc.org/), that generates a browseable wiki-style application documentating your applications type signatures. You can also customise this using comment tags to add manual descriptions.

The most advanced form of documentation-as-code is rolling your own static analysis tools. Let's say you have an event tracking service method:

```typescript
const track = async (
    name: string, 
    params: Record<string, string | number | boolean>,
  ) => {
  // ...
}

track('login', {username: 'bob', success: true});
```

It's very valuable for project managers and other stakeholders to be able to see what events are being tracked, and what parameters they take. You can write a static analysis tool using a code parsing library like [`espree`](https://github.com/eslint/espree) that scans your codebase for calls to `track`, and documents where they are being called from, and what parameters they are being called with. You can then generate a user-friendly view of this data, and deploy it as part of your documentation. Once this is encoding as a data-structure, you can also use it to see which events are not being used in your pipelines, or create a searchable list of events.

## Conclusion

By treating infrastructure and documentation as code, we can version them alongside our code, and deploy them together. This means that we can easily create new environments, and we can be confident that our documentation is up to date. We can also use static analysis tools to generate documentation, and use the data-structures they generate to create new tools and views of our codebase.
