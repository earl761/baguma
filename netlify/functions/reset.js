import { getStore } from '@netlify/blobs';

const STORE_NAME = 'votes';
const KEY = 'ballot';
const VOTERS = ['Jalia','Lydia','Florence','Aloysius','Christian','Alice'];

export default async (req) => {
  if (req.method !== 'POST')
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { 
      status: 405,
      headers: { 'content-type': 'application/json' }
    });

  try {
    const store = getStore(STORE_NAME);
    
    // Reset the ballot to initial state
    const ballot = {
      voters : Object.fromEntries(VOTERS.map(n => [n, { has_voted:false, number:null }])),
      numbers: {}
    };
    
    await store.setJSON(KEY, ballot);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to reset votes' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
};