'use client'
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./shared/table"
import { DataTableRowActions } from "./shared/row-actions"
import { TableActionProps } from "./shared/types";
import { BaseTable } from "./shared/table";
import { TablePagination, perPageCountOptions } from "./shared/pagination"
import { useEffect, useState } from "react"
import { PaginatedApiResponse } from "@/shared/types/api.types"
import clientApiHandlers from "@/client/handlers"
import { IBook } from "@/shared/types/models.types"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import definedMessages from "@/shared/constants/messages"
import { useRouter } from "next/navigation"


type Props = TableActionProps & {
    showPagination?: boolean;
    showToolbar?: boolean;
    archivedOnly?: boolean;
}

export default function BooksTable({ showPagination, showToolbar, archivedOnly, ...props }: Props) {
    const router = useRouter()
    const { toast } = useToast()
    const [tableData, setTableData] = useState<PaginatedApiResponse<IBook[]> | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(perPageCountOptions[0]);

    const loadData = async () => {
        setTableData(null)
        const res = await clientApiHandlers.books.get({
            page: currentPage, perPage: perPage,
            ...(archivedOnly && {
                where: {
                    archived: true
                }
            })
        })
        setTableData(res)
    }

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
    const handlePermanentDelete = async (books: IBook[]) => {
        const res = await clientApiHandlers.archives.deletePermanantly({
            ids: books.map((b) => b.id),
            model: "Book"
        })
        if (res.succeed) {
            toast({
                title: "Book(s) deleted successfully.",
            })
            window.location.reload()
        } else {
            toast({
                title: "Error",
                variant: "destructive",
                description: definedMessages.UNKNOWN_ERROR
            })
        }
    }
    const handleRestore = async (books: IBook[]) => {
        const res = await clientApiHandlers.archives.restore({
            ids: books.map((b) => b.id),
            model: "Book"
        })
        console.log(res)
        if (res.succeed) {
            toast({
                title: "Book(s) restored successfully.",
            })
            router.push("/dashboard/books")
        } else {
            toast({
                title: "Error",
                variant: "destructive",
                description: definedMessages.UNKNOWN_ERROR
            })
        }
    }

    useEffect(() => {
        loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, perPage])


    const pagination: TablePagination = {
        onPageChange: setCurrentPage,
        currentPage: currentPage,
        perPage: perPage,
        setPerPage: setPerPage,
        totalPages: tableData?.pagination?.totalPages ?? 1
    }


    const tableActionProps: TableActionProps = {
        ...props,
        viewAction: (book) => (
            <Link href={`/dashboard/books/${book.id}`}>View</Link>
        ),
        archiveAction: handleDelete,
        ...(archivedOnly && {
            restoreAction: handleRestore,
            deleteAction: handlePermanentDelete,
        }),
    }

    return (
        <BaseTable
            data={tableData?.data}
            columns={columns(tableActionProps)}
            toolbarActions={tableActionProps}
            pagination={pagination}
            showPagination={showPagination}
            showToolbar={showToolbar}
            getFilterValue={(table) => (table.getColumn("name")?.getFilterValue() as string ?? "")}
            setFilterValue={(table, value) => {
                table.getColumn("name")?.setFilterValue(value)
            }} />
    )
}




function columns(rowActions: TableActionProps): ColumnDef<IBook, any>[] {
    const tableCols: ColumnDef<IBook, any>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        // {
        //     id: "index",
        //     header: ({ column }) => (
        //         <DataTableColumnHeader column={column} title="#" />
        //     ),
        //     cell: ({ row }) => <div className="w-[30px]">{row.index + 1}</div>,
        //     enableSorting: false,
        //     enableHiding: false,
        // },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex max-w-[100px] space-x-2">
                        <span className="max-w-[100px] truncate font-medium">
                            {row.getValue("name")}
                        </span>
                    </div>
                )
            },
        },
        {
            accessorKey: "slug",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Slug" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center">
                        <Link href={`/dashboard/books/${row.original.id}`}
                            className="max-w-[100px] text-primary truncate font-normal">
                            {row.getValue("slug")}
                        </Link>
                    </div>
                )
            }
        },
        {
            accessorKey: "abbreviation",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Abbreviation" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center">
                        <span className="max-w-[100px] truncate font-normal">
                            {row.getValue("abbreviation")}
                        </span>
                    </div>
                )
            }
        },

    ]
    if (rowActions.deleteAction || rowActions.viewAction || rowActions.editAction) {
        tableCols.push({
            id: "actions",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Actions" />
            ),
            cell: ({ row }) => <DataTableRowActions row={row} {...rowActions} />,
        })
    }
    return tableCols
}