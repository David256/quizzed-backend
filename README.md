# quizzed-backend
Another simple CRUD but it is public.

The API is in https://quizzed-backend.herokuapp.com/.

And the documentation is in: https://quizzed-backend.herokuapp.com/api-docs/.

## Get started

Start the server with:

```bash
npm start
# Or
node .
```

### Environment variables

Some environment variables can be defined to config the server. Next will be described:

| Variable         | Description |
|------------------|-------------|
| MONGODB_PROTOCOL | The MongoDB connection protocol (e.g. "mongodb", "mongodb+srv" ). |
| MONGODB_USER     | The MongoDB database user |
| MONGODB_PASSWORD | The user password |
| MONGODB_HOST     | The MongoDB database host |
| MONGODB_DB       | The database |
| SECRET_API_TOKEN | (optional) The API token for quizapi.io service |
| PORT             | (optional, default 3000) The connection port |
| VERBOSE          | (optional) Enable verbose mode |
| AMOUNT           | (optional, default 10) The question amount to create |
