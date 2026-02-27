import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Medical Appointments API',
      version: '1.0.0',
      description: 'API para gestión de citas médicas'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        CreateAppointment: {
          type: 'object',
          required: ['patientId', 'doctorId', 'startTime'],
          properties: {
            patientId: { type: 'string', format: 'uuid' },
            doctorId: { type: 'string', format: 'uuid' },
            startTime: { type: 'string', format: 'date-time' },
            notes: { type: 'string' }
          }
        },
        UpdateAppointment: {
          type: 'object',
          properties: {
            startTime: { type: 'string', format: 'date-time' }
          }
        },
        Patient: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'integer' },
            gender: { type: 'string', enum: ['MALE', 'FEMALE'] },
            address: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            allergies: { type: 'string' }
          }
        },
        Doctor: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            specialty: { type: 'string' },
            licenseNumber: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' }
          }
        },
        ClinicalNotes: {
          type: 'object',
          required: ['observations'],
          properties: {
            observations: { type: 'string' },
            diagnosis: { type: 'string', nullable: true },
            treatment: { type: 'string', nullable: true },
            followUp: { type: 'string', nullable: true }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        BadRequest: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        NotFound: { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        Conflict: { description: 'Conflict', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        Unprocessable: { description: 'Unprocessable Entity', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        Forbidden: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    },
    paths: {
      '/appointments': {
        post: {
          summary: 'Crear cita',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateAppointment' } } } },
          responses: {
            '201': { description: 'Created' },
            '400': { $ref: '#/components/responses/BadRequest' },
            '404': { $ref: '#/components/responses/NotFound' },
            '409': { $ref: '#/components/responses/Conflict' },
            '422': { $ref: '#/components/responses/Unprocessable' }
          }
        },
        get: {
          summary: 'Obtener citas',
          responses: { '200': { description: 'OK' } }
        }
      },
      '/appointments/{id}': {
        get: {
          summary: 'Obtener cita por ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '200': { description: 'OK' },
            '404': { $ref: '#/components/responses/NotFound' }
          }
        },
        put: {
          summary: 'Modificar cita',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateAppointment' } } } },
          responses: {
            '200': { description: 'OK' },
            '404': { $ref: '#/components/responses/NotFound' },
            '409': { $ref: '#/components/responses/Conflict' },
            '422': { $ref: '#/components/responses/Unprocessable' }
          }
        }
      },
      '/appointments/{id}/cancel': {
        post: {
          summary: 'Cancelar cita',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '200': { description: 'OK' },
            '404': { $ref: '#/components/responses/NotFound' },
            '422': { $ref: '#/components/responses/Unprocessable' }
          }
        }
      },
      '/appointments/{id}/confirm': {
        post: {
          summary: 'Confirmar cita',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '200': { description: 'OK' },
            '403': { $ref: '#/components/responses/Forbidden' },
            '404': { $ref: '#/components/responses/NotFound' },
            '409': { $ref: '#/components/responses/Conflict' }
          }
        }
      },
      '/appointments/{id}/clinical-notes': {
        post: {
          summary: 'Agregar notas clínicas a una cita',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ClinicalNotes' } } } },
          responses: {
            '200': { description: 'OK' },
            '400': { $ref: '#/components/responses/BadRequest' },
            '404': { $ref: '#/components/responses/NotFound' }
          }
        }
      },
      '/patients': {
        post: {
          summary: 'Crear paciente',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Patient' } } } },
          responses: { '201': { description: 'Created' } }
        },
        get: {
          summary: 'Obtener pacientes',
          responses: { '200': { description: 'OK' } }
        }
      },
      '/patients/{id}': {
        get: {
          summary: 'Obtener paciente',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '200': { description: 'OK' },
            '404': { $ref: '#/components/responses/NotFound' }
          }
        }
      },
      '/doctors': {
        post: {
          summary: 'Crear médico',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Doctor' } } } },
          responses: { '201': { description: 'Created' } }
        },
        get: {
          summary: 'Obtener médicos',
          responses: { '200': { description: 'OK' } }
        }
      },
      '/doctors/{id}': {
        get: {
          summary: 'Obtener médico',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '200': { description: 'OK' },
            '404': { $ref: '#/components/responses/NotFound' }
          }
        }
      }
    }
  },
  apis: ['./src/**/*.ts']
};

export function setupSwagger(app: Express): void {
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  app.get('/api-docs.json', (_req, res) => {
    res.json(swaggerSpec);
  });
}
