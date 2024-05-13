import React from "react";
import Logo from "assets/images/icons/Logo.svg";
import { Link } from "react-router-dom";
import { Avatar } from "antd";
import { ReactComponent as Profile } from "assets/images/icons/profile.svg";

const Header = () => {
  return (
    <div className=" border-b-[1px] w-full">
      <div className="flex justify-between items-center h-16 w-full">
        <div className="pl-[47px]">
          <Link to="/">
            <img src={Logo} alt="" className="mx-auto w-[115px]" />
          </Link>
        </div>
        <div className="flex items-center pr-[32px]">
          <p>닉네임</p>
          <div>
            <Avatar icon={<Profile />} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
