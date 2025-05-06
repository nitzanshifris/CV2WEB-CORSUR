import { Check, ChevronsUpDown, X } from 'lucide-react';
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

export interface MultiComboboxProps {
  options: { value: string; label: string }[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  className?: string;
}

export function MultiCombobox({
  options,
  value = [],
  onValueChange,
  placeholder = 'Select options...',
  emptyText = 'No options found.',
  searchPlaceholder = 'Search...',
  className,
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false);

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
              const option = options.find(opt => opt.value === val);
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
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandGroup>
            {options.map(option => (
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
        </Command>
      </PopoverContent>
    </Popover>
  );
}
