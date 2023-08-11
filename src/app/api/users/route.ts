import defaults from "@/shared/constants/defaults"
import serverApiHandlers from "@/server/handlers"
import { NextResponse } from "next/server"


export const GET = async (req: Request) => {
    const params = new URLSearchParams(req.url.split("?")[1])
    const page = parseInt(params.get("page") ?? "1")
    const perPage = parseInt(params.get("perPage") ?? `${defaults.PER_PAGE_ITEMS}`)

    const res = await serverApiHandlers.users.getAll({ page, perPage })
    return NextResponse.json(res)
}


export async function POST(req: Request) {
    const res = await serverApiHandlers.users.create(req)
    return NextResponse.json(res)
}