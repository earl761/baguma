import { getJSON, setJSON } from '@netlify/blobs';

const BUCKET = 'votes';
const KEY    = 'ballot';
const VOTERS = ['Jalia','Lydia','Florence','Aloysius','Christian','Alice'];

export default async () => {
  let ballot = await getJSON(BUCKET, KEY);

  if (!ballot) {
    ballot = {
      voters : Object.fromEntries(VOTERS.map(n => [n, { has_voted:false, number:null }])),
      numbers: {}
    };
    await setJSON(BUCKET, KEY, ballot);
  }

  const all_voted = Object.values(ballot.voters).every(v => v.has_voted);

  return new Response(JSON.stringify({ ...ballot, all_voted }), {
    headers: { 'content-type':'application/json; charset=utf-8' }
  });
};
