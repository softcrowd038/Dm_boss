// Import required modules
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import os from 'os';

// Function to get local IP address
export const getLocalIp = () => {
  // Get all network interfaces
  const interfaces = os.networkInterfaces();
  
  // Loop through all interfaces
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      // Return the first IPv4 address that's not internal
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost'; // Fallback to localhost if no IP found
};

// Swagger configuration options
const options = {
  definition: {
    openapi: '3.0.0', // Specify OpenAPI version
    info: {
      title: 'Vehicle Dealership Management System API',
      version: '1.0.0',
      description: 'API documentation for the dealership system',
      contact: {
        name: 'API Support',
        email: 'support@dealership.com'
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }], // Default security requirement
    servers: [ // Define server URLs
      {
        url: 'http://localhost:5002', // Base URL (no /api/v1 here)
        description: 'Local development server'
      },
      {
        url: 'http://{ip}:5002', // Template for network IP
        description: 'Network access',
        variables: {
          ip: {
            default: getLocalIp(), // Will be replaced with actual IP
            description: 'Your local IP address'
          }
        }
      }
    ]
  },
  apis: ['./routes/*.js'] // Path to route files with JSDoc comments
};

// Generate Swagger specification
const specs = swaggerJsdoc(options);

// Swagger UI configuration
const swaggerUiOptions = {
  customSiteTitle: "Vehicle Dealership API Docs",
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    validatorUrl: null, // Disable validator
    persistAuthorization: true, // Save auth between refreshes
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'] // Allowed methods
  }
};

// Setup Swagger middleware
export const swaggerSetup = (app) => {
  // Endpoint to serve dynamic Swagger JSON
  app.get('/api-docs/swagger.json', (req, res) => {
    const dynamicSpecs = {
      ...specs,
      servers: [
        {
          url: `${req.protocol}://${req.get('host')}`, // Dynamic base URL
          description: 'Current server'
        }
      ]
    };
    res.setHeader('Content-Type', 'application/json');
    res.send(dynamicSpecs);
  });

  // Serve Swagger UI
  app.use('/api-docs',
    swaggerUi.serve, // Middleware to serve Swagger UI assets
    (req, res, next) => {
      // Custom CSP headers for Swagger UI
      res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'");
      next();
    },
    swaggerUi.setup(null, { // Setup Swagger UI with our options
      ...swaggerUiOptions,
      explorer: true, // Enable search bar
      swaggerUrl: '/api-docs/swagger.json' // Source of Swagger spec
    })
  );
};

// Export default if needed
export default {
  swaggerSetup,
  getLocalIp
};