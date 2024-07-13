// app/api/special-code/redeem/route.ts

import { redeemSpecialCode } from "@/app/server-actions/specialCodeActions";


export async function POST(req: Request) {
  const data = await req.json();



  console.log("redeam ode data",data);
  

  try {
    const redeemedCode = await redeemSpecialCode(data);

    console.log("redeemedCode",redeemedCode);
    
    return new Response(JSON.stringify(redeemedCode), { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    return new Response(JSON.stringify({ error: 'An unknown error occurred' }), { status: 400 });
  }
}
