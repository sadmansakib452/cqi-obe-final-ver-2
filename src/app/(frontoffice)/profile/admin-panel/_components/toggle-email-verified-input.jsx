"use client";

import { toggleEmailVerifiedAction } from "@/actions/admin/toggle-email-verified-action";
import { useTransition } from "react";

const ToggleEmailVerifiedInput = ({ email, emailVerified, isAdmin }) => {
  const [isPending, startTransition] = useTransition(); // Correct destructuring

  const clickHandler = (email, isCurrentlyVerified) => {
    startTransition(async () => {
      await toggleEmailVerifiedAction(email, isCurrentlyVerified);
    });
  };

  return (
    <div className="flex items-center justify-center">
      <input
        disabled={isAdmin || isPending}
        type="checkbox"
        checked={!!emailVerified}
        className="scale-150 enabled:cursor-pointer disabled:opacity-50"
        readOnly
        onClick={clickHandler.bind(null, email, !!emailVerified)}
      />
    </div>
  );
};

export default ToggleEmailVerifiedInput;
