
"use client";

import { useState, useEffect } from 'react';

interface ClientFormattedDateProps {
  dateString: string | undefined | null;
  className?: string;
  loadingText?: string;
  invalidDateText?: string;
}

export function ClientFormattedDate({
  dateString,
  className,
  loadingText = "Loading date...",
  invalidDateText = "Invalid date"
}: ClientFormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && dateString) {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        setFormattedDate(date.toLocaleString());
      } else {
        setFormattedDate(invalidDateText);
      }
    } else if (isClient && !dateString) {
      setFormattedDate(invalidDateText); 
    }
  }, [dateString, isClient, invalidDateText]);

  if (!isClient) {
    return <span className={className}>{loadingText}</span>;
  }

  return <span className={className}>{formattedDate || loadingText}</span>;
}
