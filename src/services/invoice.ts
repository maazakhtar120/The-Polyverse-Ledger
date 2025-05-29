import { PrismaClient } from '@prisma/client';
import { create } from 'ipfs-http-client';
import { ethers } from 'ethers';

const prisma = new PrismaClient();
const ipfs = create({ url: process.env.IPFS_URL || 'http://localhost:5001' });

export class InvoiceService {
  static async create(data: {
    userId: string;
    blockchainId: string;
    amount: number;
    dueDate: Date;
  }) {
    // Store invoice data in IPFS
    const ipfsResult = await ipfs.add(JSON.stringify({
      ...data,
      timestamp: new Date().toISOString()
    }));

    const invoice = await prisma.invoice.create({
      data: {
        ...data,
        status: 'unpaid',
        ipfsHash: ipfsResult.path
      }
    });

    return invoice;
  }

  static async tokenize(invoiceId: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId }
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    if (invoice.tokenized) {
      throw new Error('Invoice already tokenized');
    }

    // Here you would implement the actual tokenization logic
    // using smart contracts on the respective blockchain

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { tokenized: true }
    });

    return invoice;
  }
}