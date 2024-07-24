'use client'

import * as React from "react"
import { cn } from "../../utils/cn"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, forwardedRef) => {
    const innerRef = React.useRef<HTMLTextAreaElement>(null);
    const [isFocused, setIsFocused] = React.useState(false);

    React.useImperativeHandle(forwardedRef, () => innerRef.current!);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (innerRef.current && !innerRef.current.contains(event.target as Node)) {
          setIsFocused(false);
          resetHeight;
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const handleFocus = () => {
      setIsFocused(true);
      adjustHeight();
    };

    const handleBlur = () => {
      setIsFocused(false);
      adjustHeight(true);
    };

    const adjustHeight = (shrink = false) => {
      const textarea = innerRef.current;
      if (textarea) {
        if (shrink) {
          textarea.style.height = '18px';
        } else {
          textarea.style.height = 'auto';
          const currentRows = textarea.value.split('\n').length;
          textarea.rows = Math.max(currentRows + 1, 2);
          textarea.style.height = `${textarea.scrollHeight}px`;
        }
      }
    };

    const resetHeight = () => {
        const textarea = innerRef.current;
        if (textarea) {
            textarea.style.height = '18px';
            textarea.style.height = `${Math.max(textarea.scrollHeight, 40)}px`; // 40px is approx. 2.5rem
          }
        };

    const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
      adjustHeight();
      if (props.onInput) {
        props.onInput(event);
      }
    };

    return (
      <textarea
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-in-out resize-none",
          isFocused ? "min-h-[4.5em]" : "min-h-[2.5rem]",
          "md:max-h-[12em] max-h-[6em]",
          className
        )}
        ref={innerRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
        rows={1}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export default Textarea