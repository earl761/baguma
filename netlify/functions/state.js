// netlify/functions/state.js
import { getStore } from '@netlify/blobs';

const VOTERS = ['Jalia', 'Lydia', 'Florence', 'Aloysius', 'Christian', 'Alice'];

export default async () => {
  const store  = getStore('votes');          // bucket name "votes"
  let   ballot = await store.getJSON('ballot');

  // First run → create the initial, empty ballot.
  if (!ballot) {
    ballot = {
      voters : Object.fromEntries(VOTERS.map(n => [n, { has_voted: false, number: null }])),
      numbers: {}                            // number ➜ name
    };
    await store.setJSON('ballot', ballot);
  }

  const all_voted = Object.values(ballot.voters).every(v => v.has_voted);

  return new Response(JSON.stringify({ ...ballot, all_voted }), {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
};
