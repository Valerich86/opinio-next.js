import NavLinks from "./nav-links";
import ProfileLink from "./profile-link";
import { CreateLink, LogOutButton, SearchButton } from "./buttons";
import Logo from "./logo";

export default function Header() {
  return (
    <div
      className={`flex py-1 justify-between items-center w-full px-5 fixed z-10 bg-primary top-0 border-b border-gray-300`}
    >
      <div className="flex w-1/4">
        <Logo />
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <NavLinks />
      </div>
      <div className="w-1/4 flex justify-end items-center gap-3">
        <CreateLink />
        <SearchButton />
        <ProfileLink />
        <LogOutButton />
      </div>
    </div>
  );
}
