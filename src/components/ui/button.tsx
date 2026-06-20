import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-cyan-300/60 focus-visible:ring-2 focus-visible:ring-cyan-300/40 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-rose-300/50 aria-invalid:ring-2 aria-invalid:ring-rose-300/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-cyan-300 text-[#04111d] hover:bg-cyan-200 [a]:hover:bg-cyan-200",
        outline:
          "border-cyan-100/15 bg-[#06111f]/80 text-zinc-100 hover:border-cyan-300/35 hover:bg-cyan-400/[0.08] hover:text-cyan-100 aria-expanded:border-cyan-300/35 aria-expanded:bg-cyan-400/[0.08]",
        secondary:
          "border-cyan-100/15 bg-[#071321]/90 text-zinc-100 hover:border-cyan-300/35 hover:bg-cyan-400/[0.08] aria-expanded:border-cyan-300/35 aria-expanded:bg-cyan-400/[0.08]",
        ghost:
          "text-zinc-300 hover:bg-cyan-400/[0.08] hover:text-cyan-100 aria-expanded:bg-cyan-400/[0.08] aria-expanded:text-cyan-100",
        destructive:
          "border-rose-300/20 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20 focus-visible:border-rose-300/40 focus-visible:ring-rose-300/20",
        link: "text-cyan-200 underline-offset-4 hover:text-cyan-100 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
