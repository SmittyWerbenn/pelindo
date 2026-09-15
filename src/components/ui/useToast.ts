import { useCallback, useState } from "react";

export function useToast(duration = 3000) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback(
    (msg: string) => {
      setMessage(msg);
      window.setTimeout(() => setMessage(null), duration);
    },
    [duration]
  );

  return { toastMessage: message, showToast };
}
