import * as uuid from 'uuid';
import {
	DynamoDBClient,
	PutItemCommand,
	GetItemCommand,
	ScanCommand,
	UpdateItemCommand,
	DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';

import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const awsConfig = {
	accessKeyId: process.env.ACCESS_KEY,
	secretAccessKey: process.env.SECRET_ACCESS_KEY,
	region: process.env.REGION,
	endpoint: process.env.ENDPOINT_URL,
};

const client = new DynamoDBClient(awsConfig);

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const Item = {
			id: { S: uuid.v4() },
			content: { S: req.body.content },
		};
		await client.send(
			new PutItemCommand({
				TableName: process.env.TABLE_NAME,
				Item,
			})
		);

		return res.status(201).json(Item);
	}

	if (req.method === 'GET') {
		try {
			if (req.query.id) {
				return res.status(200).json(await getDataById(req.query.id));
			} else {
				return res.status(200).json(await getAllData());
			}
		} catch (error) {
			console.error(error);
		}

		// getItem(req, res);

		// const Item = req.query.id
		// 	? await client.send(
		// 			new GetItemCommand({
		// 				TableName: process.env.TABLE_NAME,
		// 				Key: {
		// 					id: { S: req.query.id },
		// 				},
		// 			})
		// 	  )
		// 	: await client.send(
		// 			new ScanCommand({ TableName: process.env.TABLE_NAME })
		// 	  );
		// const Item = await client.send(new ScanCommand({ TableName: process.env.TABLE_NAME}));
		// return res.status(200).json(Item);
	}

	if (req.method === 'PUT') {
		// verify req.body.id is already exists in the database
		const { Attributes } = await client.send(
			new UpdateItemCommand({
				TableName: process.env.TABLE_NAME,
				Key: {
					id: { S: req.body.id },
				},
				UpdateExpression: 'set content = :c',
				ExpressionAttributeValues: {
					':c': { S: req.body.content },
				},
				ReturnValues: 'ALL_NEW',
			})
		);

		return res.status(200).json(Attributes);
	}

	if (req.method === 'DELETE') {
		console.log(req.body);
		await client.send(
			new DeleteItemCommand({
				TableName: process.env.TABLE_NAME,
				Key: {
					id: { S: req.body.id },
				},
			})
		);

		return res.status(204).json({});
	}
}

// const getItem = async (req, res) => {
// 	const param = {
// 		TableName: process.env.TABLE_NAME,
// 		Key: marshall({ id: req.query.id}),
// 	};
// 	try {
// 		const data = await client.send(new GetItemCommand(param));
// 		// console.log(unmarshall(data.Item));
// 		return res.status(200).json(unmarshall(data.Item));
// 	} catch (error) {
// 		console.error(error);
// 	}
// };

// const getItem = async (req, res) => {
// 	try {
// 		if (req.query.id) {
// 			const dataGetById = await client.send(new GetItemCommand({
// 				TableName: process.env.TABLE_NAME,
// 				Key: marshall({ id: req.query.id }),
// 			}));
// 			return res
// 			.status(200)
// 			.json(unmarshall(dataGetById.Item));
// 		} else {
// 			const dataGetAll = await client.send(new ScanCommand({TableName: process.env.TABLE_NAME,}));
// 			const unmarshalledItems = dataGetAll.Items.map(item => unmarshall(item));
// 			return res
// 				.status(200)
// 				.json(unmarshalledItems);
// 		}
// 	} catch (error) {
// 		console.error(error);
// 	}
// };

async function getDataById(id: string) {
	try {
		const data = await client.send(
			new GetItemCommand({
				TableName: process.env.TABLE_NAME,
				Key: marshall({ id: id }),
			})
		);
		if (data.Item) {
			return unmarshall(data.Item);
		} else {
			throw new Error('Item not found');
		}
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function getAllData() {
	try {
		const data = await client.send(
			new ScanCommand({ TableName: process.env.TABLE_NAME })
		);
		if (data.Items && data.Items.length > 0) {
			return data.Items.map((item) => unmarshall(item));
		} else {
			throw new Error('Empty');
		}
	} catch (error) {
		console.error(error);
		throw error;
	}
}
