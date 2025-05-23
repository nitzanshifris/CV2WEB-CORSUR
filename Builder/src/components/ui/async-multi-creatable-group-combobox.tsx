import { Check, ChevronsUpDown, Loader2, Plus, X } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface AsyncMultiCreatableGroupComboboxProps {
  options: { label: string; options: { value: string; label: string }[] }[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  onSearch?: (query: string) => Promise<void>;
  onCreate?: (value: string) => Promise<void>;
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  className?: string;
  loading?: boolean;
}

export function AsyncMultiCreatableGroupCombobox({
  options,
  value = [],
  onValueChange,
  onSearch,
  onCreate,
  placeholder = 'Select options...',
  emptyText = 'No options found.',
  searchPlaceholder = 'Search...',
  className,
  loading = false,
}: AsyncMultiCreatableGroupComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        onSearch?.(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

  const handleCreate = async () => {
    if (onCreate && searchQuery) {
      await onCreate(searchQuery);
      setSearchQuery('');
    }
  };

  const allOptions = options.reduce(
    (acc, group) => [...acc, ...group.options],
    [] as { value: string; label: string }[]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          <div className="flex flex-wrap gap-1">
            {value.length === 0 && <span>{placeholder}</span>}
            {value.map(val => {
              const option = allOptions.find(opt => opt.value === val);
              return (
                <Badge
                  key={val}
                  variant="secondary"
                  className="mr-1"
                  onClick={e => {
                    e.stopPropagation();
                    onValueChange?.(value.filter(v => v !== val));
                  }}
                >
                  {option?.label}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              );
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
                    <Button variant="ghost" size="sm" className="h-8" onClick={handleCreate}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create "{searchQuery}"
                    </Button>
                  </div>
                ) : (
                  emptyText
                )}
              </CommandEmpty>
              {options.map(group => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.options.map(option => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={currentValue => {
                        onValueChange?.(
                          value.includes(currentValue)
                            ? value.filter(v => v !== currentValue)
                            : [...value, currentValue]
                        );
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value.includes(option.value) ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
