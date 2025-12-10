import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <div className="bg-secondary w-[100] border border-[#090C9B] rounded-full">
      <Link href={"/"} className="hover:opacity-90">
      <Image
        src="/opinio.png"
        alt="Opinio logo"
        width={50}
        height={50}
        priority
      />
    </Link>
    </div>
  );
}
