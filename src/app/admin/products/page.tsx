"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import Image from 'next/image'
import { GetProductsResponse } from "@/app/api/admin/products/route"
import { APIError } from "@/lib/error"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import useSWR from 'swr'
import { Inventory, MtgCard, Product } from "@prisma/client"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export default function Page() {
  const searchParams = useSearchParams()
  const search = searchParams.get('search') || ""
  const page = parseInt(searchParams.get('page') || "1")

  const { data, error, isLoading } = useSWR<GetProductsResponse, APIError>(`/api/admin/products?page=${page}`, (url: string | URL | Request) => fetch(url).then(r => r.json()))

  if (isLoading) {
    return <>Loading Skeleton Goes Here</>
  }

  if (error || !data) {
    return <>{JSON.stringify(data)}</>
  }

  return (
    <div>
      <h1>Products ({data.pagination.total})</h1>

      <div>
        <Link href="/admin/products/new">Add Product</Link>
        <Link href="/admin/products/bulk-add">Bulk Add</Link>
      </div>

      <form>
        <input type="text" name="search" placeholder="Search..." defaultValue={search} />
        {/* <select name="type" defaultValue={type}>
          <option value="all">All Types</option>
          <option value="MTG_SINGLE">MTG Singles</option>
          <option value="SEALED_PRODUCT">Sealed</option>
          <option value="ACCESSORY">Accessories</option>
        </select> */}
        <button type="submit">Filter</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Set</th>
            <th>Inventory</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.products.map((product) => {
            const totalQty = product.inventory.reduce((sum, inv) => sum + inv.quantity, 0)
            const minPrice = Math.min(...product.inventory.map((inv) => Number(inv.price)))

            return (
              <tr key={product.id}>
                <td>
                  {product.imageUrl && <Image src={product.imageUrl} alt={product.name} width={50} />}
                  {product.name}
                </td>
                <td>{product.mtgCard?.setName}</td>
                <td>{totalQty} total</td>
                <td>${minPrice.toFixed(2)}</td>
                <td>
                  <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                  {" | "}
                  <form action={`/api/admin/products/${product.id}`} method="POST" style={{ display: 'inline' }}>
                    <input type="hidden" name="_method" value="DELETE" />
                    <button type="submit">Delete</button>
                  </form>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {data.pagination.totalPages > 1 && (
        <div>
          Page {data.pagination.page} of {data.pagination.totalPages}
          {data.pagination.page > 1 && <Link href={`?page=${data.pagination.page - 1}`}>Previous</Link>}
          {data.pagination.page < data.pagination.totalPages && <Link href={`?page=${data.pagination.page + 1}`}>Next</Link>}
        </div>
      )}

      <ProductTable data={data.products} columns={columns} page={data.pagination.page} totalPages={data.pagination.totalPages} />
    </div>
  )
}

type Data = (Product & { mtgCard: MtgCard | null } & { inventory: Inventory[] })

export const columns: ColumnDef<Data>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Card",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "inventory",
    header: "Inventory",
    cell: ({ row }) => {
      const inventory: Inventory[] = row.getValue("inventory")
      const totalQty = inventory.reduce((sum, inv) => sum + inv.quantity, 0)

      return (
        <div>{totalQty}</div>
      )
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: () => {
      // const totalQty =  row.inventory.reduce((sum, inv) => sum + inv.quantity, 0)
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(0.00)

      return (
        <div className="text-right font-medium">{formatted}</div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      // const payment = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {/* <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

interface ProductTableProps {
  data: Data[];
  columns: ColumnDef<Data>[];
  page: number;
  totalPages: number
}

export function ProductTable({ page, totalPages, ...props }: ProductTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})

  const data = React.useMemo(() => props.data, [props.data])
  const cols = React.useMemo(() => props.columns, [props.columns])

  const table = useReactTable<Data>({
    data,
    columns: cols,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="">

          <Pagination>
            <PaginationContent>

              <PaginationItem>
                <PaginationPrevious href={`?page=${page - 1}`} aria-disabled={page <= 1} tabIndex={page <= 1 ? -1 : undefined} className={
                  page <= 1 ? "pointer-events-none opacity-50" : undefined
                } />
              </PaginationItem>

              {(page - 1 > 0) &&
                <>
                  {(page - 2 <= totalPages) &&
                    <PaginationItem>
                      <PaginationLink href={`?page=${page - 2}`}>{page - 2}</PaginationLink>
                    </PaginationItem>
                  }

                  <PaginationItem>
                    <PaginationLink href={`?page=${page - 1}`}>{page - 1}</PaginationLink>
                  </PaginationItem>
                </>
              }

              <PaginationItem>
                <PaginationLink href={`?page=${page}`} isActive={true}>{page}</PaginationLink>
              </PaginationItem>

              {(page + 1 <= totalPages) &&
                <>
                  <PaginationItem>
                    <PaginationLink href={`?page=${page + 1}`}>{page + 1}</PaginationLink>
                  </PaginationItem>

                  {(page + 1 <= totalPages) &&
                    <PaginationItem>
                      <PaginationLink href={`?page=${page + 2}`}>{page + 2}</PaginationLink>
                    </PaginationItem>
                  }
                </>
              }

              <PaginationItem>
                <PaginationNext href={`?page=${page + 1}`} aria-disabled={page + 1 > totalPages} tabIndex={page + 1 > totalPages ? -1 : undefined} className={
                  page + 1 > totalPages ? "pointer-events-none opacity-50" : undefined
                } />
              </PaginationItem>

            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}