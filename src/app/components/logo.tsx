import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"} className="hover:opacity-90">
      <Image
        src="/opinio.png"
        alt="Opinio logo"
        width={60}
        height={60}
        priority
      />
    </Link>
  );
}
