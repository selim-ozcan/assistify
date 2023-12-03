import React, { useContext } from "react";
import {
  Navbar as MTNavbar,
  MobileNav,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Card,
  IconButton,
  Collapse,
} from "@material-tailwind/react";
import {
  CubeTransparentIcon,
  UserCircleIcon,
  CodeBracketSquareIcon,
  Square3Stack3DIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  RocketLaunchIcon,
  Bars2Icon,
} from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import UserContext from "@/context/store";
import { useRouter } from "next/router";

// profile menu component
const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
  },
  {
    label: "Help",
    icon: LifebuoyIcon,
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
  },
];

function ProfileMenu(props: any) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = useRouter();

  const closeMenu = (label: string) => {
    props.setUser(null);
    setIsMenuOpen(false);
  };

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-gray-900 p-0.5"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <MenuItem
              key={label}
              onClick={() => {
                if (isLastItem) router.push("/auth/signin");
                closeMenu(label);
              }}
              className={`flex items-center gap-2 rounded ${
                isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem ? "red" : "inherit"}
              >
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

// nav list component
const navListItems = [
  {
    label: "Scan Product",
    icon: CubeTransparentIcon,
  },
];

function NavList(props) {
  return (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      {navListItems.map(({ label, icon }, key) => (
        <Link
          key={label}
          onClick={() => props.onElementClick()}
          href={"/products/scanner"}
        >
          <Typography
            href="#"
            variant="small"
            color="gray"
            className="font-medium text-blue-gray-500"
          >
            <MenuItem className="flex items-center gap-2 lg:rounded-full">
              {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
              <span className="text-gray-900"> {label}</span>
            </MenuItem>
          </Typography>
        </Link>
      ))}
      {props?.user?.role === "employee" ? (
        <Link
          key={"Customer Queue"}
          onClick={() => props.onElementClick()}
          href={"/queue"}
        >
          <Typography
            href="#"
            variant="small"
            color="gray"
            className="font-medium text-blue-gray-500"
          >
            <MenuItem className="flex items-center gap-2 lg:rounded-full">
              {React.createElement(Square3Stack3DIcon, {
                className: "h-[18px] w-[18px]",
              })}{" "}
              <span className="text-gray-900"> Customer Queue</span>
            </MenuItem>
          </Typography>
        </Link>
      ) : null}
      {props?.user?.role === "manager" ? (
        <Link
          key={"Employee Performance"}
          onClick={() => props.onElementClick()}
          href={"/employee-stats"}
        >
          <Typography
            href="#"
            variant="small"
            color="gray"
            className="font-medium text-blue-gray-500"
          >
            <MenuItem className="flex items-center gap-2 lg:rounded-full">
              {React.createElement(Square3Stack3DIcon, {
                className: "h-[18px] w-[18px]",
              })}{" "}
              <span className="text-gray-900"> Employee Performance</span>
            </MenuItem>
          </Typography>
        </Link>
      ) : null}
    </ul>
  );
}

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const router = useRouter();

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );
  }, []);

  return (
    <MTNavbar
      className={`mx-auto p-2 lg:pl-6 top-0 z-10 max-w-full sticky bg-light-green-100 rounded-none min-h-[9vh]`}
    >
      <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          className="mr-4 ml-2 cursor-pointer py-1.5 font-bold italic text-blue-gray-800"
        >
          Assistify
        </Typography>
        <div className="hidden lg:block">
          <NavList />
        </div>
        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className={`ml-auto mr-2 lg:hidden ${user ? "" : "hidden"}`}
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton>

        {!user && router.pathname !== "/auth/signin" && (
          <Link href={"/auth/signin"} legacyBehavior>
            <span className="capitalize">sign in</span>
          </Link>
        )}

        {user && <ProfileMenu setUser={setUser} />}
      </div>
      <Collapse open={isNavOpen} className="overflow-scroll">
        <NavList user={user} onElementClick={toggleIsNavOpen} />
      </Collapse>
    </MTNavbar>
  );
}
