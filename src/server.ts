import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import { blockchainRoutes } from './routes/blockchain.ts';
import { userRoutes } from './routes/user.ts';
import { invoiceRoutes } from './routes/invoice.ts';
import { creditScoreRoutes } from './routes/creditScore.ts';

const fastify = Fastify({
  logger: true
});

// Register plugins
fastify.register(cors, {
  origin: true
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecret'
});

fastify.register(swagger, {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'MythosNet Universal Registry Protocol API',
      description: 'API documentation for the Universal Blockchain Registry Protocol',
      version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  },
  exposeRoute: true
});

// Register routes
fastify.register(blockchainRoutes, { prefix: '/api/v1/blockchain' });
fastify.register(userRoutes, { prefix: '/api/v1/users' });
fastify.register(invoiceRoutes, { prefix: '/api/v1/invoices' });
fastify.register(creditScoreRoutes, { prefix: '/api/v1/credit-score' });

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info(`Server listening on ${fastify.server.address()}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();