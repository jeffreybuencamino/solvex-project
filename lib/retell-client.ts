// ==========================================
// INITIALIZES RETELL CLIENT
// ==========================================

import Retell from 'retell-sdk';
import { cache } from 'react';

// SERVER COMPONENT THAT CREATES RETELL CLIENT 
export const createRetellClient = cache(() => {
  if (!process.env.RETELL_API_KEY) {
    throw new Error('RETELL_API_KEY missing');
  }
  return new Retell({ apiKey: process.env.RETELL_API_KEY });
});