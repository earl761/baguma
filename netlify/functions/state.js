import { getStore } from '@netlify/blobs';

const STORE_NAME = 'votes';
const KEY = 'ballot';
const VOTERS = ['Jalia','Lydia','Florence','Aloysius','Christian','Alice'];

export default async () => {
  const store = getStore(STORE_NAME);
  let ballot = await store.get(KEY, { type: 'json' });

  if (!ballot) {
    ballot = {
      voters : Object.fromEntries(VOTERS.map(n => [n, { has_voted:false, number:null }])),
      numbers: {}
    };
    await store.setJSON(KEY, ballot);
  }

  const all_voted = Object.values(ballot.voters).every(v => v.has_voted);

  return new Response(JSON.stringify({ ...ballot, all_voted }), {
    headers: { 'content-type':'application/json; charset=utf-8' }
  });
};
