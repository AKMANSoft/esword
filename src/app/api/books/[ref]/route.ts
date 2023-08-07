import apiHandlers from "@/server/handlers"
import { NextResponse } from "next/server"




type RouteParams = { params: { ref: string } }

// Get By Slug
export async function GET(req: Request, { params }: RouteParams) {
    const res = await apiHandlers.books.getByRef(params.ref)
    return NextResponse.json(res)
}

// Update
export async function PUT(req: Request, { params }: RouteParams) {
    const res = await apiHandlers.books.update(req, parseInt(params.ref))
    return NextResponse.json(res)
}


// Delete
export async function DELETE(req: Request, { params }: RouteParams) {
    const res = await apiHandlers.books.archive(parseInt(params.ref))
    return NextResponse.json(res)
}

