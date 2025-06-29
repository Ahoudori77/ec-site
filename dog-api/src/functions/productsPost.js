const { app } = require('@azure/functions');

app.http('productsPost', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log(`productsPost にリクエストを受け取りました: ${request.url}`);

        try {
            const product = await request.json();

      context.log('受け取った商品データ:', product);

      return {
        status: 200,
        jsonBody: {
          message: '商品データを受け取りました！',
          data: product
        }
      };
    } catch (error) {
      context.log.error('JSON解析エラー:', error);

      return {
        status: 400,
        jsonBody: {
          error: '不正なデータ形式です（JSON形式で送ってね）'
        }
      };
    }
  }
});
