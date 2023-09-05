import serverApiHandlers from "@/server/handlers"
import { NextResponse } from "next/server"




type RouteParams = { params: { ref: string } }

// Get By Ref
export async function GET(req: Request, { params }: RouteParams) {
    const res = await serverApiHandlers.books.getByRef(params.ref)
    return NextResponse.json(res)
}

// Update
export async function PUT(req: Request, { params }: RouteParams) {
    const res = await serverApiHandlers.books.update(req, parseInt(params.ref))
    return NextResponse.json(res)
}


// Delete
export async function DELETE(req: Request, { params }: RouteParams) {
    const res = await serverApiHandlers.books.archive(parseInt(params.ref))
    return NextResponse.json(res)
}

