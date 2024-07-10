// app/api/special-code/delete/route.ts

import { deleteSpecialCode } from "@/app/server-actions/specialCodeActions";


export async function DELETE(req: Request) {
  const { code, adminUserId } = await req.json();

  try {
    const result = await deleteSpecialCode(code, adminUserId);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    return new Response(JSON.stringify({ error: 'An unknown error occurred' }), { status: 400 });
  }
}
