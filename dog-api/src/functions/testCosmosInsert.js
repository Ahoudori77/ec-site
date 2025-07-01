const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");
require("dotenv").config();

app.http("testCosmosInsert", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const endpoint = process.env.COSMOS_DB_URI;
    const key = process.env.COSMOS_DB_KEY;
    const dbName = process.env.COSMOS_DB_NAME;
    const containerName = process.env.COSMOS_DB_CONTAINER;

    try {
      const client = new CosmosClient({ endpoint, key });
      const db = client.database(dbName);
      const container = db.container(containerName);

      const item = {
        id: `${Date.now()}`,
        name: "テスト商品",
        category: "おもちゃ",
        price: 1000,
        created_at: new Date().toISOString(),
      };

      const { resource: createdItem } = await container.items.create(item);

      return {
        status: 200,
        jsonBody: { message: "アイテム追加成功", item: createdItem },
      };
    } catch (err) {
      return {
        status: 500,
        jsonBody: { error: err.message },
      };
    }
  },
});
