import {NextResponse} from "next/server";
import {db} from "@/config/db";
import {usersTable} from "@/config/schema";

export async function POST(eq) {
    const {userEmail, name} = await req.json();

    const users = await db.select().from(usersTable)
        .where(eq(usersTable.email, email));

    if(users?.length==0) {
        const result = await db.insert(usersTable).values({
            name: name,
            email: email
        }).returning(usersTable);

        console.log(result);
        return NextResponse.json(result);
    }

    return NextResponse.json(users[0])
}