'use client';

import { BiSearchAlt } from "react-icons/bi"; 
import { RiLogoutBoxLine } from "react-icons/ri";
import { CgFileAdd } from "react-icons/cg";
import Link from "next/link";
import { redirect } from "next/navigation";
import SearchModal from "../modals/modal-search";
import { useState } from "react";

export function EnterLink() {
  return (
    <Link
      href={`/newSurvey`}
      className="rounded-md border py-2 bg-accent hover:opacity-80 active:scale-99 active:transition active:duration-100 text-white font-semibold w-50 flex gap-2 justify-center items-center"
    >
      Создать опрос
    </Link>
  );
}

export function CreateLink() {
  return (
    <Link
      href={`/newSurvey`}
      className="hidden md:flex rounded-md border py-2 bg-accent hover:opacity-80 active:scale-99 active:transition active:duration-100 text-white font-semibold w-40 flex gap-2 justify-center items-center"
    >
      <CgFileAdd /> Новый опрос
    </Link>
  );
}

export function SearchButton() {
  const [openModal, setOpenModal] = useState(false);

  const openSearchModal = () => {
    setOpenModal(true);
  };

  const closeSearchModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <button
      onClick={openSearchModal}
      className="hidden md:flex hover:opacity-80 justify-center pt-1 cursor-pointer"
    >
      <BiSearchAlt size={35}/>
    </button>
    <SearchModal isOpen={openModal} closeModal={closeSearchModal}/>
    </>
  );
}

export function LogOutButton() {
  return (
    <form action={async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      redirect("/");
    }}>
      <button
        type="submit"
        className="hover:opacity-80 flex justify-center items-center cursor-pointer"
      >
        <RiLogoutBoxLine size={30} />
      </button>
    </form>
  );
}

