import NavLinks from "./nav-links";
import ProfileLink from "./profile-link";
import { CreateLink } from "./buttons";
import { siteConfig } from "../utilities/site.config";
import Logo from "./logo";

export default function Header() {
  return (
    <div className={`flex justify-between items-center h-[${siteConfig.headerHeight}] w-screen px-5 fixed z-10 bg-primary top-0`}>
      <div className="flex w-1/3">
        <Logo/>
      </div>
      <div className="w-1/3 flex justify-center items-center">
        <NavLinks />
      </div>
      <div className="w-1/3 flex justify-end items-center gap-3">
        <CreateLink />
        <ProfileLink />
      </div>
    </div>
  );
}
