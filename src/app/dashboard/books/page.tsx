'use client'
import BooksTable from "@/components/dashboard/tables/books.table";
import BooksForm from "@/components/dashboard/forms/books.form";
import { useState } from "react";
import clientApiHandlers from "@/client/handlers";
import { useToast } from "@/components/ui/use-toast";
import definedMessages from "@/shared/constants/messages";
import Link from "next/link";
import { IBook } from "@/shared/types/models.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";



export default function Page() {
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const { toast } = useToast();

  const handleDelete = async (book: IBook) => {
    const res = await clientApiHandlers.books.archive(book.id)
    if (res.succeed) {
      window.location.reload()
    } else if (res.code === "DATA_LINKED") {
      toast({
        title: "Book can not be deleted.",
        variant: "destructive",
        description: "All chapters linked with this book must be unlinked in order to delete this book."
      })
    } else {
      toast({
        title: "Error",
        variant: "destructive",
        description: definedMessages.UNKNOWN_ERROR
      })
    }
  }
  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-8 w-full">
        <Card className="min-h-[600px]">
          <CardHeader className="border-b-8 border-silver-light py-4">
            <CardTitle className="font-bold text-2xl">
              Books
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <BooksTable
              viewAction={(book) => (
                <Link href={`/dashboard/books/${book.id}`}>View</Link>
              )}
              editAction={(book) => (
                <span onClick={() => setSelectedBook(book)}>
                  Edit
                </span>
              )}
              deleteAction={handleDelete} />

          </CardContent>
        </Card>
      </div>
      <div className="col-span-4">
        <BooksForm book={selectedBook} onReset={() => setSelectedBook(null)} />
      </div>
    </div>
  )
}