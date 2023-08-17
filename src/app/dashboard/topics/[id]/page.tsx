import { BackButton } from "@/components/dashboard/buttons";
import ChaptersTable from "@/components/dashboard/tables/chapters.table";
import serverApiHandlers from "@/server/handlers";
import { notFound } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/dashboard/ui/card"
import { buttonVariants } from "@/components/dashboard/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import db from "@/server/db";
import { IBook, ITopic } from "@/shared/types/models.types";
import VersesTable from "@/components/dashboard/tables/verses.table";


export default async function Page({ params }: { params: { id: string } }) {
    const { data: topic } = await serverApiHandlers.topics.getById(Number(params.id), {
        chapter: { include: { book: true } }
    })
    if (!topic) return notFound()
    const next = await db.topic.findFirst({
        take: 1,
        where: {
            id: {
                gt: Number(params.id),
            },
            archived: false
        },
        orderBy: {
            id: "asc",
        },
    });
    const previous = await db.topic.findFirst({
        take: 1,
        where: {
            id: {
                lt: Number(params.id),
            },
            archived: false
        },
        orderBy: {
            id: "asc",
        },
    });


    return (
        <div className="space-y-8">
            <div className="flex items-center gap-5 justify-between">
                <div className="flex items-center gap-5">
                    <BackButton />
                    <h1 className="font-semibold text-2xl">
                        {topic?.name}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={previous ? `/dashboard/topics/${previous.id}` : '#'}
                        className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "aspect-square p-1 w-auto h-auto rounded-full",
                            !previous && "opacity-60 pointer-events-none"
                        )}>
                        <ChevronLeftIcon className="w-6 h-6" />
                    </Link>
                    <Link
                        href={next ? `/dashboard/topics/${next.id}` : '#'}
                        className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "aspect-square p-1 w-auto h-auto rounded-full",
                            !next && "opacity-60 pointer-events-none"
                        )}>
                        <ChevronRightIcon className="w-6 h-6" />
                    </Link>
                </div>
            </div>
            <TopicDetailsCard topic={topic} />
            <div className="pt-5">
                <h3 className="font-semibold text-2xl mb-5">Verses</h3>
                <VersesTable topic={topic} />
            </div>
        </div>
    )
}


function TopicDetailsCard({ topic }: { topic: ITopic }) {
    return (
        <Card className="w-fit">
            <CardHeader>
                <CardTitle className="text-xl">Topic Details</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between gap-20">
                <div className="flex items-center gap-5 flex-wrap text-base font-normal">
                    <span>Book:</span>
                    <span className="font-semibold">{topic?.chapter?.book?.name}</span>
                </div>
                <div className="flex items-center gap-5 text-base font-normal">
                    <span>Chapter:</span>
                    <span className="font-semibold">{(topic?.chapter)?.name}</span>
                </div>
                <div className="flex items-center gap-5 text-base font-normal">
                    <span>Name:</span>
                    <span className="font-semibold">{topic.name}</span>
                </div>
                <div className="flex items-center gap-5 text-base font-normal">
                    <span>Number:</span>
                    <span className="font-semibold">{topic.number}</span>
                </div>
            </CardContent>
        </Card>
    )
}