## Overview

This is an example of a Next.js application using DynamoDB for simple CRUD operations.

## How to

1. Create a new [IAM role](https://aws.amazon.com/iam/) with permission for `AmazonDynamoDBFullAccess`
2. Save the access key and secret key.
3. Create a new [DynamoDB table](https://aws.amazon.com/dynamodb/) with a primary key of `id` and type `String` (the sort key is optional).
4. Save the region and table name.
5. Create an `.env.local` file similar to `.env.local.example`.
6. Add the access key, secret key, region, and table name to `.env.local`.

## Testing

### POST

```bash
curl -X POST http://localhost:3000/api/item -d '{"content": "test"}' -H "Content-type: application/json"
```

### GET

```bash
curl http://localhost:3000/api/item\?id\=bdc38386-2b35-47a3-bdfc-8ee29bd0686f
```

### PUT

```bash
curl -X PUT http://localhost:3000/api/item -d '{"content": "updated", "id": "bdc38386-2b35-47a3-bdfc-8ee29bd0686f"}' -H "Content-type: application/json"
```

### DELETE

```bash
curl -X DELETE http://localhost:3000/api/item\?id\=bdc38386-2b35-47a3-bdfc-8ee29bd0686f
```

## DB setup

```bash
aws dynamodb list-tables --endpoint-url http://localhost:8000
```

```bash
aws dynamodb create-table \
    --table-name Todo \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --table-class STANDARD \
    --endpoint-url http://localhost:8000
```


```bash
aws dynamodb put-item \
    --table-name Todo  \
    --item \
        '{"id": {"S": "1"}, "content": {"S": "Call Me Today"}}' \
    --endpoint-url http://localhost:8000
    
aws dynamodb put-item \
    --table-name Todo  \
    --item \
        '{"id": {"S": "2"}, "content": {"S": "Happy Day"}}' \
    --endpoint-url http://localhost:8000

aws dynamodb put-item \
    --table-name Todo \
    --item \
        '{"id": {"S": "3"}, "content": {"S": "PartiQL Rocks"}}' \
    --endpoint-url http://localhost:8000

```

```bash
aws dynamodb query \
    --table-name Todo \
    --endpoint-url http://localhost:8000

aws dynamodb execute-statement --statement "SELECT * FROM Todo" --endpoint-url http://localhost:8000
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
