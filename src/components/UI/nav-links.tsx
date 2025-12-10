"use client";

import { RiSurveyLine } from "react-icons/ri"; 
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { GrMoney } from "react-icons/gr";
import { CgNotes } from "react-icons/cg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { name: "Все опросы", href: "/surveys", icon: RiSurveyLine },
  { name: "О нас", href: "/about", icon: AiOutlineInfoCircle },
  { name: "Сервисы", href: "/services", icon: CgNotes },
  { name: "Тарифы", href: "/plans", icon: GrMoney },
];

export default function NavLinks() {
  const pathName = usePathname();

  return (
    <>
      <div className="flex lg:hidden justify-center items-center w-full">
        <GiHamburgerMenu className="block md:hidden" size={30}/>
      </div>
      <div className="hidden md:flex gap-10">
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "flex items-center justify-center text-sm font-medium hover:opacity-80",
                {
                  "text-neutral": pathName === link.href,
                }
              )}
            >
              <LinkIcon className="w-10" />
              <p className="hidden md:block font-bold">{link.name}</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
