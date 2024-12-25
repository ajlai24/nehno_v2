import * as React from "react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { MdClear } from "react-icons/md";

type IconProps = React.SVGProps<SVGSVGElement> & { children?: never };

type IconPropsWithBehavior<T extends IconProps> = T & {
  behavior: "append" | "prepend";
};

type IconComponent<T extends IconProps = IconProps> = React.ComponentType<T>;

export type InputProps<T extends IconComponent = IconComponent> =
  React.InputHTMLAttributes<HTMLInputElement> & {
    icon?: T;
    iconProps: T extends IconComponent<infer P>
      ? IconPropsWithBehavior<P>
      : never;
  };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, iconProps, value, onChange, ...props }, ref) => {
    const [inputValue, setInputValue] = useState(value || "");

    const {
      behavior: iconBehavior,
      className: iconClassName,
      ...iconPropsRest
    } = iconProps || {};

    const Icon = icon;

    const handleClear = () => {
      if (onChange) {
        onChange({
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      }
      setInputValue("");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div
        className={cn(
          "m-0 flex items-center justify-center rounded-md border border-input bg-transparent p-0 px-3 py-0 text-sm shadow-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50 relative",
          className
        )}
      >
        {Icon && type !== "file" && iconBehavior === "prepend" && (
          <Icon
            className={cn("mr-3 h-4 w-4 text-muted-foreground", iconClassName)}
            {...iconPropsRest}
          />
        )}
        <input
          type={type}
          value={value !== undefined ? value : inputValue}
          onChange={handleChange}
          className={cn(
            "flex h-9 w-full items-center justify-center bg-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 pr-5",
            type !== "file" ? "py-1" : "py-1.5",
            className
          )}
          ref={ref}
          {...props}
        />
        {inputValue && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            onClick={handleClear}
            aria-label="Clear"
          >
            <MdClear className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
        {Icon && type !== "file" && iconBehavior === "append" && (
          <Icon
            className={cn("ml-3 h-4 w-4 text-muted-foreground", iconClassName)}
            {...iconPropsRest}
          />
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
