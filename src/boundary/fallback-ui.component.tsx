import {FC} from "react";
import {FallBack} from "./types.ts";

interface FallbackUIProps {
  fallback: FallBack
}

export const FallbackUI: FC<FallbackUIProps> = ({fallback}) => {
  switch (fallback) {
    case 'refresh':
      return (
        <button onClick={() => window.location.reload()}>Refresh</button>
      )
    case 'unmount':
      return null;
    case 'default':
      return <div className="w-64 border-4 p-4 bg-amber-300 border-amber-600">Error Fallback</div>
    default:
      return fallback
  }
}