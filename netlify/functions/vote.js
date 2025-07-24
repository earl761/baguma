import { getStore } from '@netlify/blobs';

const STORE_NAME = 'votes';
const KEY = 'ballot';

export default async (req) => {
  if (req.method !== 'POST')
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { 
      status: 405,
      headers: { 'content-type': 'application/json' }
    });

  try {
    const { name, number } = await req.json();

    if (!name || !number) {
      return new Response(JSON.stringify({ error: 'Name and number are required' }), { 
        status: 400,
        headers: { 'content-type': 'application/json' }
      });
    }

    const store = getStore(STORE_NAME);
     let ballot = await store.get(KEY, { type: 'json' }) || { voters:{}, numbers:{} };

     if (!ballot.voters[name])
       return new Response(JSON.stringify({ error:'Unknown voter' }), { 
         status:400,
         headers: { 'content-type': 'application/json' }
       });
     if (ballot.voters[name].has_voted)
       return new Response(JSON.stringify({ error:'You have already voted' }), { 
         status:409,
         headers: { 'content-type': 'application/json' }
       });
     if (ballot.numbers[number])
       return new Response(JSON.stringify({ error:'Number already taken' }), { 
         status:409,
         headers: { 'content-type': 'application/json' }
       });

     // Atomic update to prevent race conditions
     ballot.voters[name] = { has_voted:true, number };
     ballot.numbers[number] = name;
     await store.setJSON(KEY, ballot);

    return new Response(JSON.stringify({ ok:true }), {
      headers:{ 'content-type':'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request data' }), {
      status: 400,
      headers: { 'content-type': 'application/json' }
    });
  }
};
