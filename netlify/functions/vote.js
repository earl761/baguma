import { getJSON, setJSON } from '@netlify/blobs';

const BUCKET = 'votes';
const KEY    = 'ballot';

export default async (req) => {
  if (req.method !== 'POST')
    return new Response('Method Not Allowed', { status: 405 });

  const { name, number } = await req.json();

  let ballot = await getJSON(BUCKET, KEY) || { voters:{}, numbers:{} };

  if (!ballot.voters[name])
    return new Response(JSON.stringify({ error:'Unknown voter' }), { status:400 });
  if (ballot.voters[name].has_voted)
    return new Response(JSON.stringify({ error:'Already voted' }), { status:409 });
  if (ballot.numbers[number])
    return new Response(JSON.stringify({ error:'Number taken' }), { status:409 });

  ballot.voters[name] = { has_voted:true, number };
  ballot.numbers[number] = name;
  await setJSON(BUCKET, KEY, ballot);

  return new Response(JSON.stringify({ ok:true }), {
    headers:{ 'content-type':'application/json' }
  });
};
