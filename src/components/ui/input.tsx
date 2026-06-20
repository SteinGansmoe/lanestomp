import * as React from "react";

import { cn } from "@/src/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded border border-cyan-100/15 bg-[#06111f]/80 px-3 py-2 text-base text-zinc-100 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-100 placeholder:text-zinc-500 hover:border-cyan-100/25 focus-visible:border-cyan-300/65 focus-visible:ring-2 focus-visible:ring-cyan-300/25 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[#08111d]/80 disabled:text-zinc-500 disabled:opacity-70 aria-invalid:border-rose-300/50 aria-invalid:ring-2 aria-invalid:ring-rose-300/20 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
