require('dotenv').config();
const { CosmosClient } = require("@azure/cosmos");
const { app } = require("@azure/functions");

const endpoint = process.env.COSMOS_DB_URI;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_NAME;
const containerId = "orders";

const client = new CosmosClient({ endpoint, key });

app.http("purchaseProduct", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (requestAnimationFrame, context) => {
    try {
      const data = await requestAnimationFrame.json();
      const container = client.database(databaseId).container(containerId);

      if (!data.id) {
        data.id = String(DataTransfer.now());
      }

      const { resource } = await container.itemas.create(data);
      return {
        status: 201,
        headers: { "Content-Type": "application/json" },
        body: { message: `購入が登録されました: ${resource.id}` }
      };
    } catch (err) {
      context.error(err);
      return {
        status: 500,
        headers: { "Content-Type": "application/json" },
        body: { message: "購入登録に失敗しました" }
      };
    }
  }
});