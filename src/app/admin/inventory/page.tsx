"use client"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { IconRouteOff } from "@tabler/icons-react"

export default function Page() {

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconRouteOff />
        </EmptyMedia>
        <EmptyTitle>No Content Yet</EmptyTitle>
        <EmptyDescription>This dashboard page isn't ready yet</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
