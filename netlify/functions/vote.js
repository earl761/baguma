// netlify/functions/vote.js
import { getStore } from '@netlify/blobs';

export default async (req) => {
  if (req.method !== 'POST')
    return new Response('Method Not Allowed', { status: 405 });

  let body;
  try { body = await req.json(); }
  catch { return new Response('Bad JSON', { status: 400 }); }

  const { name, number } = body || {};
  if (!name || typeof number !== 'number')
    return new Response(JSON.stringify({ error: 'name and number required' }), { status: 400 });

  const store = getStore('votes');
  const ballot = (await store.getJSON('ballot')) || { voters:{}, numbers:{} };

  if (!ballot.voters[name])
    return new Response(JSON.stringify({ error: 'Unknown voter' }), { status: 400 });

  if (ballot.voters[name].has_voted)
    return new Response(JSON.stringify({ error: 'That voter already cast a vote' }), { status: 409 });

  if (ballot.numbers[number])
    return new Response(JSON.stringify({ error: 'Number already taken' }), { status: 409 });

  ballot.voters[name] = { has_voted:true, number };
  ballot.numbers[number] = name;
  await store.setJSON('ballot', ballot);

  return new Response(JSON.stringify({ ok:true }), {
    headers: { 'content-type': 'application/json' }
  });
};
