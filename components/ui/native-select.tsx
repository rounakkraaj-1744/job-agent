"use client";

import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const EMPTY_VALUE = "__jobpilot_empty__";

type OptionProps = {
  value?: string;
  disabled?: boolean;
  children?: ReactNode;
};

type NativeSelectProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (event: { target: { value: string } }) => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
  id?: string;
};

export function NativeSelect({
  value,
  defaultValue,
  onChange,
  children,
  className,
  disabled,
  ...props
}: NativeSelectProps) {
  const options = Children.toArray(children).flatMap((child, index) => {
    if (!isValidElement<OptionProps>(child)) return [];
    const option = child as ReactElement<OptionProps>;
    const label = option.props.children;
    const optionValue =
      option.props.value ?? (typeof label === "string" ? label : "");

    return [
      {
        key: option.key ?? `${optionValue}-${index}`,
        value: optionValue || EMPTY_VALUE,
        label,
        disabled: option.props.disabled,
      },
    ];
  });
  const selectedValue = value ?? defaultValue ?? "";

  return (
    <Select
      value={selectedValue || EMPTY_VALUE}
      disabled={disabled}
      onValueChange={(nextValue) =>
        onChange?.({ target: { value: nextValue === EMPTY_VALUE ? "" : nextValue } })
      }
    >
      <SelectTrigger
        {...props}
        disabled={disabled}
        className={cn(
          "h-9 w-full rounded-md border border-[#dfe5e8] bg-white px-3 text-xs text-[#26343c]",
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.key}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
