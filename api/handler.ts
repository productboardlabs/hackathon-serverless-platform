import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import axios from "axios";
import * as IAM from "aws-sdk/clients/iam";
import { Client } from "pg";
import * as generator from "generate-password";

const iam = new IAM({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: "eu-central-1",
  apiVersion: "2010-05-08"
});

const dbClient = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASS,
  database: "hacking",
  port: 5432
});

let isDbClientConnected = false;

export const setup: APIGatewayProxyHandler = async (event, _context) => {
  _context.callbackWaitsForEmptyEventLoop = false;

  const email =
    event.queryStringParameters && event.queryStringParameters.email;

  if (event.httpMethod !== "GET" || !email) {
    return {
      statusCode: 400,
      body: "Invalid request"
    };
  }

  // Reuse opened database connection
  if (!isDbClientConnected) {
    await dbClient.connect();
    isDbClientConnected = true;
  }

  const username = email.replace(/\W/g, ""); // username is also a database name
  const password = generator.generate();

  const params = {
    UserName: email
  };

  /**
   * 1. Send slack invitation
   * 2. Create dedicated database
   * 3. Create new IAM user
   */

  try {
    await Promise.all([
      axios.get(
        `https://hacking-slack-event.slack.com/api/users.admin.invite?token=${
          process.env.SLACK_TOKEN
        }&email=${email}`
      ),

      dbClient.query(`CREATE DATABASE ${username};`).then(() =>
        // TODO: https://node-postgres.com/features/queries#parameterized-query
        dbClient.query(`
        CREATE USER ${username} WITH PASSWORD '${password}';
        GRANT ALL PRIVILEGES ON DATABASE ${username} TO ${username};`)
      ),

      iam.createUser(params).promise()
    ]);

    const data = await Promise.all([
      iam.addUserToGroup({ ...params, GroupName: "hacking-slack" }).promise(),
      iam.createLoginProfile({
        ...params,
        Password: password,
        PasswordResetRequired: false
      }),
      iam.createAccessKey(params).promise()
    ]);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        aws: {
          consoleUrl: process.env.AWS_CONSOLE_URL,
          iamUserName: email,
          password,
          ...data[2]
        },
        database: {
          engine: process.env.DB_ENGINE,
          name: username,
          user: username,
          password,
          host: process.env.DB_HOST,
          port: 5432
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};
