// import { NextResponse } from 'next/server';
// import { getDb } from '@/lib/mongodb';  // Your exact file

// export async function GET() {
//     try {
//         const db = await getDb();
//         const clients = await db.collection('clients').find({}).toArray(); // All clients

//         return NextResponse.json(clients);  // Auto JSON + 200
//     } catch (error) {
//         return NextResponse.json(
//             { error: "Failed to fetch clients", status: 500}
//         )
//     }
// }