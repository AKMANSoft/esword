import serverApiHandlers from "@/server/handlers"
import { ArchivesActionReq } from "@/shared/types/reqs.types"
import { NextResponse } from "next/server"




export async function POST(req: Request) {
    const body = (await req.json()) as ArchivesActionReq
    const res = await serverApiHandlers.archives.dump(body)
    return NextResponse.json(res)
}
