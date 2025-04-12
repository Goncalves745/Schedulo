const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Schedulo API",
      version: "1.0.0",
      description: `
        A Schedulo API permite gerir negócios, serviços, disponibilidades e marcações.
        Oferece endpoints públicos para clientes efetuarem marcações e endpoints protegidos
        para que empresas possam gerir os seus serviços e horários.
      `,
      contact: {
        email: "diogo.soares.g2003@icloud.com",
      },
    },
    servers: [
      {
        url: "https://localhost:3000/api/",
        description: "API local de desenvolvimento",
      },
    ],
    paths: {
      "/auth/signup": {
        post: {
          tags: ["auth"],
          summary: "Registo de novo utilizador/empresa",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SignupRequest",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Utilizador criado com sucesso",
            },
            500: {
              description: "Erro no servidor",
            },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["auth"],
          summary: "Autenticação do utilizador",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginRequest",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login efetuado com sucesso",
            },
            401: {
              description: "Credenciais inválidas",
            },
          },
        },
      },
      "/public/{slug}/services": {
        get: {
          tags: ["public"],
          summary: "Lista os serviços disponíveis para um negócio",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              style: "simple",
              explode: false,
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            200: {
              description: "Lista de serviços",
            },
          },
        },
      },
      "/public/{slug}/availability": {
        get: {
          tags: ["public"],
          summary: "Devolve os dias e horários disponíveis para marcações",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              style: "simple",
              explode: false,
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            200: {
              description: "Lista de disponibilidades",
            },
          },
        },
      },
      "/business/appointments/create": {
        post: {
          tags: ["appointments"],
          summary: "Criação de uma nova marcação",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateAppointmentRequest",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Marcação criada com sucesso",
            },
            400: {
              description: "Erro na criação da marcação",
            },
          },
        },
      },
    },
    components: {
      schemas: {
        SignupRequest: {
          type: "object",
          properties: {
            business_name: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
            phone: { type: "string" },
            address: { type: "string" },
          },
          required: ["business_name", "email", "password"],
        },
        LoginRequest: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
          required: ["email", "password"],
        },
        CreateAppointmentRequest: {
          type: "object",
          properties: {
            service_id: { type: "string" },
            date: { type: "string", format: "date-time" },
            client_name: { type: "string" },
            client_email: { type: "string", format: "email" },
            client_phone: { type: "string" },
          },
          required: ["service_id", "date", "client_name"],
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
