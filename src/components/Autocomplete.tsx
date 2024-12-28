import {
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import debounce from "lodash.debounce";
import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { MdClear } from "react-icons/md";
import { Button } from "./ui/button";

export type Option = Record<"value" | "label", string> & Record<string, string>;

type AutoCompleteProps = {
  options: Option[];
  emptyMessage: string;
  value?: Option;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onQueryChange?: (query: string) => void;
  onSelect?: (value: Option | undefined) => void;
  onSearch?: (query: string) => void;
};

export const AutoComplete = ({
  options,
  placeholder,
  emptyMessage,
  value,
  disabled,
  isLoading = false,
  onQueryChange,
  onSelect,
  onSearch,
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string | undefined>(
    value?.label || ""
  );

  const debouncedQuery = useRef(
    debounce((query: string) => {
      if (onQueryChange) {
        onQueryChange(query);
      }
    }, 500)
  ).current;

  // Handle input changes and trigger debounced query
  const handleInputChange = (value: string) => {
    setInputValue(value);
    debouncedQuery(value);
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      if (event.key === "Enter" && input.value !== "") {
        const optionToSelect = options.find(
          (option) => option.label === input.value
        );
        if (optionToSelect) {
          onSelect?.(optionToSelect);
        } else {
          onSearch?.(inputValue || "");
        }
      }

      if (event.key === "Escape") {
        input.blur();
      }
    },
    [isOpen, options, onSelect, onSearch, inputValue]
  );

  const handleBlur = () => {
    setOpen(false);
  };

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.label);
      onSelect?.(selectedOption);

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onSelect]
  );

  const handleClear = useCallback(() => {
    setInputValue("");
    onSelect?.(undefined);
  }, [onSelect]);

  return (
    <CommandPrimitive onKeyDown={handleKeyDown} shouldFilter={false}>
      <div className="relative">
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={isLoading ? undefined : handleInputChange}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="text-base pr-8"
        />
        {inputValue && inputValue?.length > 0 && (
          <Button
            className="absolute right-2 top-0"
            size="icon"
            variant="ghost"
            onClick={handleClear}
          >
            <MdClear />
          </Button>
        )}
      </div>
      <div className="relative mt-1">
        <div
          className={cn(
            "animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-xl outline-none bg-white dark:bg-neutral-600",
            isOpen ? "block" : "hidden"
          )}
        >
          <CommandList className="rounded-lg">
            {isLoading ? (
              <CommandPrimitive.Loading>
                <div className="p-1">
                  <Skeleton className="h-8 w-full" />
                </div>
              </CommandPrimitive.Loading>
            ) : null}

            <CommandItem forceMount value="-" className="hidden" />

            {options.length > 0 && !isLoading && (
              <CommandGroup>
                {options.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onSelect={() => handleSelectOption(option)}
                      className="flex w-full items-center gap-2"
                    >
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            {!isLoading && (
              <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                {emptyMessage}
              </CommandPrimitive.Empty>
            )}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  );
};
