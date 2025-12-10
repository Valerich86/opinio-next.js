import React from "react";

export default function FormError({ errorField }: { errorField: string | undefined }) {
  return (
    <div aria-live="assertive" role="alert">
      <p className="mt-2 text-warning">{errorField}</p>
    </div>
  );
}
