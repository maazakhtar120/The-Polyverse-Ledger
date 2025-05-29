import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createUserSchema = z.object({
  blockchainId: z.string().uuid(),
  walletAddress: z.string()
});

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/', {
    schema: {
      body: {
        type: 'object',
        required: ['blockchainId', 'walletAddress'],
        properties: {
          blockchainId: { type: 'string' },
          walletAddress: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { blockchainId, walletAddress } = createUserSchema.parse(request.body);
    
    const user = await prisma.user.create({
      data: {
        blockchainId,
        walletAddress
      }
    });
    
    return reply.code(201).send(user);
  });

  fastify.get('/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        transactions: true,
        invoices: true
      }
    });
    
    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }
    
    return user;
  });
}