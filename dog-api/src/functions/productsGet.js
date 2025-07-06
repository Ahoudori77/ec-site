require('dotenv').config();
const { CosmosClient } = require("@azure/cosmos");
const { app } = require("@azure/functions");

const endpoint = process.env.COSMOS_DB_URI;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_NAME;
const containerId = process.env.COSMOS_DB_CONTAINER;

const client = new CosmosClient({ endpoint, key });

app.http("productsGet", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const container = client.database(databaseId).container(containerId);

      const querySpec = {
        query: "SELECT * FROM c WHERE c.is_active = true"
      };

      const { resources: items } = await container.items.query(querySpec).fetchAll();

      return {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items)
      };
    } catch (err) {
      context.error(err);
      return {
        status: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "商品取得に失敗しました" })
      };
    }
  },
});
