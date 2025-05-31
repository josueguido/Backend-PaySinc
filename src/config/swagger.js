const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PaySinc API",
      version: "1.0.0",
      description: "API for managing expenses, friends, and groups",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.js"]
,
};

export default options;
// This code is used to generate Swagger documentation for the API.
// It defines the API's metadata, security schemes, and server information.