import type { User } from '@prisma/client';

export async function calculateRiskScore(user: User): Promise<number> {
  // This is a simplified risk scoring model
  // In production, you would use a proper ML model
  
  const transactionCount = user.transactions?.length || 0;
  const invoiceCount = user.invoices?.length || 0;
  
  // Basic risk factors:
  // 1. Transaction history length
  // 2. Invoice payment history
  // 3. Account age (in days)
  
  const accountAge = (new Date().getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24);
  
  // Calculate base score (0-1)
  let score = 0;
  
  // Transaction history weight
  score += Math.min(transactionCount / 100, 1) * 0.4;
  
  // Invoice history weight
  score += Math.min(invoiceCount / 20, 1) * 0.3;
  
  // Account age weight
  score += Math.min(accountAge / 365, 1) * 0.3;
  
  return score;
}