import * as React from "react"
import { Check, ChevronsUpDown, Loader2, Plus, X } from "lucide-react"
import { useVirtualizer } from "@tanstack/react-virtual"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface AsyncMultiCreatableGroupVirtualizedComboboxProps {
  options: { label: string; options: { value: string; label: string }[] }[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  onSearch?: (query: string) => Promise<void>
  onCreate?: (value: string) => Promise<void>
  placeholder?: string
  emptyText?: string
  searchPlaceholder?: string
  className?: string
  loading?: boolean
  itemHeight?: number
  overscan?: number
}

export function AsyncMultiCreatableGroupVirtualizedCombobox({
  options,
  value = [],
  onValueChange,
  onSearch,
  onCreate,
  placeholder = "Select options...",
  emptyText = "No options found.",
  searchPlaceholder = "Search...",
  className,
  loading = false,
  itemHeight = 32,
  overscan = 5,
}: AsyncMultiCreatableGroupVirtualizedComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        onSearch?.(searchQuery)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, onSearch])

  const handleCreate = async () => {
    if (onCreate && searchQuery) {
      await onCreate(searchQuery)
      setSearchQuery("")
    }
  }

  const allOptions = options.reduce(
    (acc, group) => [...acc, ...group.options],
    [] as { value: string; label: string }[]
  )

  const parentRef = React.useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: options.reduce((acc, group) => acc + group.options.length + 1, 0),
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan,
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex flex-wrap gap-1">
            {value.length === 0 && <span>{placeholder}</span>}
            {value.map((val) => {
              const option = allOptions.find((opt) => opt.value === val)
              return (
                <Badge
                  key={val}
                  variant="secondary"
                  className="mr-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    onValueChange?.(value.filter((v) => v !== val))
                  }}
                >
                  {option?.label}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              )
            })}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <>
              <CommandEmpty>
                {onCreate && searchQuery ? (
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <span>No results found.</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={handleCreate}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create "{searchQuery}"
                    </Button>
                  </div>
                ) : (
                  emptyText
                )}
              </CommandEmpty>
              <div
                ref={parentRef}
                className="h-[300px] overflow-auto"
                style={{
                  contain: "strict",
                }}
              >
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    let currentIndex = 0
                    let currentGroupIndex = 0
                    let currentOptionIndex = 0

                    for (let i = 0; i < options.length; i++) {
                      if (virtualRow.index === currentIndex) {
                        return (
                          <div
                            key={options[i].label}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: `${itemHeight}px`,
                              transform: `translateY(${virtualRow.start}px)`,
                            }}
                          >
                            <CommandGroup heading={options[i].label}>
                              {options[i].options.map((option) => (
                                <CommandItem
                                  key={option.value}
                                  value={option.value}
                                  onSelect={(currentValue) => {
                                    onValueChange?.(
                                      value.includes(currentValue)
                                        ? value.filter((v) => v !== currentValue)
                                        : [...value, currentValue]
                                    )
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      value.includes(option.value)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {option.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </div>
                        )
                      }
                      currentIndex++
                      currentOptionIndex = 0

                      for (let j = 0; j < options[i].options.length; j++) {
                        if (virtualRow.index === currentIndex) {
                          return (
                            <div
                              key={options[i].options[j].value}
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: `${itemHeight}px`,
                                transform: `translateY(${virtualRow.start}px)`,
                              }}
                            >
                              <CommandItem
                                value={options[i].options[j].value}
                                onSelect={(currentValue) => {
                                  onValueChange?.(
                                    value.includes(currentValue)
                                      ? value.filter((v) => v !== currentValue)
                                      : [...value, currentValue]
                                  )
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    value.includes(options[i].options[j].value)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {options[i].options[j].label}
                              </CommandItem>
                            </div>
                          )
                        }
                        currentIndex++
                        currentOptionIndex++
                      }
                    }
                    return null
                  })}
                </div>
              </div>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
} 