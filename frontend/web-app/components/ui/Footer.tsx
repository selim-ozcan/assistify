import { Card, Typography } from "@material-tailwind/react";

export default function Footer() {
  return (
    <footer className="flex w-full h-[15vh] flex-row flex-wrap items-center justify-center gap-y-1 gap-x-12 border-t border-blue-gray-50 py-6 text-center md:justify-between bg-light-green-100">
      <Typography className="font-normal text-gray-800 mb-1">
        &copy; <span className="text-gray-800">2023 Assistify</span>
      </Typography>
      <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
        <li>
          <Typography
            as="a"
            href="#"
            className="text-black font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
          >
            About Us
          </Typography>
        </li>
        <li>
          <Typography
            as="a"
            href="#"
            color="blue-gray"
            className="text-black font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
          >
            License
          </Typography>
        </li>
        <li>
          <Typography
            as="a"
            href="#"
            color="blue-gray"
            className="text-black font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
          >
            Contact Us
          </Typography>
        </li>
      </ul>
    </footer>
  );
}
