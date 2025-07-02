require('dotenv').config();

const { CosmosClient } = require("@azure/cosmos");
const { app } = require("@azure/functions");

const endpoint = process.env.COSMOS_DB_URI;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_NAME;
const containerId = process.env.COSMOS_DB_CONTAINER;

const client = new CosmosClient({ endpoint, key });

app.http("productsPost", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const data = await request.json();
      const container = client.database(databaseId).container(containerId);

      if (!data.id) {
        data.id = String(Date.now());
      }

      const { resource } = await container.items.create(data);
      return { 
        status: 201, 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message:`商品が登録されました: ${resource.id}` 
        })
      };
    } catch (err) {
      context.error(err);
      return { 
        status: 500, 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message:"登録に失敗しました"
        })
      };
    }
  },
});
