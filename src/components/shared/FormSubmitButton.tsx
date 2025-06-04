"use client";

import { useFormStatus } from 'react-dom';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormSubmitButtonProps extends ButtonProps {
  buttonText: string;
  pendingText?: string;
}

export default function FormSubmitButton({ 
  buttonText, 
  pendingText, 
  variant = "default", 
  size = "default",
  className,
  ...props 
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      disabled={pending}
      variant={variant}
      size={size}
      className={className}
      {...props}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {pendingText || "Submitting..."}
        </>
      ) : (
        buttonText
      )}
    </Button>
  );
}
