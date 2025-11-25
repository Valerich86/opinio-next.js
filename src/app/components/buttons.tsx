import { CgFileAdd } from "react-icons/cg"; 
import { CgEnter } from "react-icons/cg"; 
import Link from 'next/link';

export function EnterLink() {
  return (
    <Link
      href={`/login`}
      className="rounded-md border py-2 bg-accent hover:opacity-80 active:scale-99 active:transition active:duration-100 text-white font-semibold w-50 flex gap-2 justify-center items-center"
    >
      Войти <CgEnter size={30}/>
    </Link>
  );
}

export function CreateLink() {
  return (
    <Link
      href={`/create`}
      className="hidden md:flex rounded-md border py-2 bg-create hover:opacity-80 active:scale-99 active:transition active:duration-100 text-white font-semibold w-40 flex gap-2 justify-center items-center"
    >
      Новый опрос <CgFileAdd />
    </Link>
  );
}