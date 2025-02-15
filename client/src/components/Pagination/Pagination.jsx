import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

export default function Pagination({ pages }) {
  const pageNumbers = Array.from({ length: pages }, (_, index) => index + 1);
  return (
    <div className="pagination__content gap-3 flex w-full justify-center items-center mt-24">
      <div className="prev-page px-3 py-3 rounded cursor-pointer bg-[#254E58] text-[#FBFAF8] duration-300 hover:bg-[#88BDBC] hover:text-black">
        <FaAngleLeft />
      </div>
      <div className="pagination-pages flex items-center gap-3">
        {pageNumbers.map((page) => (
          <span className="px-4 py-2 cursor-pointer rounded bg-[#254E58] text-[#FBFAF8] duration-300 hover:bg-[#88BDBC] hover:text-black">
            {page}
          </span>
        ))}
      </div>
      <div className="next-page px-3 py-3 rounded cursor-pointer bg-[#254E58] text-[#FBFAF8] duration-300 hover:bg-[#88BDBC] hover:text-black">
        <FaAngleRight />
      </div>
    </div>
  );
}
