# Serverless Hackathon Platform

> ⚠️ This repo provides only high-level overview that can help you to set up similiar platform.

🚀 [productboard](https://www.productboard.com/) was hosting Hacking Slack Event.
We wanted to help our attendes to get up to speed and with this reason in
mind prepared this platform. It can:

- send invitations to slack workspace
- create AWS users with console and programmatic access
- create new database per user
- allow to deploy serverless endpoints

Here are high-level steps that need to be performed if you would like
to set up similiar platform.

- create a new Slack workspace
- sign up for AWS account
- create IAM policy (`aws-config/policy.json`) and assign it to IAM group
- spin up new RDS instance, we used _PostgreSQL_
- deploy api and built version of app
