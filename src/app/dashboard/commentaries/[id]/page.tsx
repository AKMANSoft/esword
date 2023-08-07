import { BackButton } from "@/components/buttons";
import apiHandlers from "@/server/handlers";
import { Chapter, Commentary, Verse } from "@prisma/client";
import { notFound } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import VersesTable from "@/components/tables/verses.table";
import CommentariesTable from "@/components/tables/commentaries.table";



export default async function Page({ params }: { params: { id: string } }) {
    const { data: verse } = await apiHandlers.verses.getById(parseInt(params.id), { commentaries: true, chapter: { include: { book: true } }, notes: true })
    if (!verse) return notFound()
    const commentaries = (verse as any).commentaries?.map((cmntry: Commentary) => ({ ...cmntry, verse: verse }))

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-5">
                <BackButton />
                <h1 className="font-semibold text-2xl">
                    {verse?.name}
                </h1>
            </div>
            <div className="max-w-screen-xl">
                <p>{verse.text}</p>
            </div>
            <VerseDetailsCard verse={verse} />
            {commentaries && <CommentariesTable commentaries={commentaries} />}
        </div>
    )
}


function VerseDetailsCard({ verse }: { verse: Verse }) {
    return (
        <Card className="w-fit">
            <CardHeader>
                <CardTitle className="text-xl">Verse Details</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between gap-20">
                <div className="flex items-center gap-5 flex-wrap text-base font-normal">
                    <span>Book:</span>
                    <span className="font-semibold">{((verse as any).chapter as any)?.book?.name}</span>
                </div>
                <div className="flex items-center gap-5 text-base font-normal">
                    <span>Chapter:</span>
                    <span className="font-semibold">{((verse as any).chapter)?.name}</span>
                </div>
                <div className="flex items-center gap-5 text-base font-normal">
                    <span>Name:</span>
                    <span className="font-semibold">{verse.name}</span>
                </div>
                <div className="flex items-center gap-5 text-base font-normal">
                    <span>Number:</span>
                    <span className="font-semibold">{verse.number}</span>
                </div>
                <div className="flex items-center gap-5 text-base font-normal">
                    <span>Type:</span>
                    <span className="font-semibold">{verse.type}</span>
                </div>
            </CardContent>
        </Card>
    )
}