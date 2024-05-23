import React from "react";
import Logo from "assets/images/icons/Logo.svg";
import { Link } from "react-router-dom";
import SvgProfile from "components/Icons/Profile";

const Header = () => {
  return (
    <div className="h-16 border-b-[1px] w-full fixed top-0 left-0 bg-white z-[1000000]">
      <div className="flex justify-between items-center h-16 w-full">
        <div className="pl-[47px]">
          <Link to="/">
            <img src={Logo} alt="" className="mx-auto w-[115px]" />
          </Link>
        </div>
        <div className="flex items-center pr-[32px]">
          <p>닉네임</p>
          <div>
            <SvgProfile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
