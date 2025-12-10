"use client";

import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function ProfileLink() {
  const pathName = usePathname();

  return (
    <Link
      href="/profile"
      className={clsx(
        "hover:opacity-80 flex justify-center",
        {
          "text-neutral": pathName === "/profile",
        }
      )}
    >
      <CgProfile size={30} />
    </Link>
  );
}
