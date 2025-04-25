"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const buttonStyle = {
  margin: "4px 0px",
  padding: "8px 4px",
  cursor: "pointer",
};

const inputStyle = {
  margin: "4px",
  border: "none",
  padding: "0 0 0 2px",
  outline: "none",
  boxShadow: "none",
};

const outerInputStyle = {
  display: "flex",
  "flex-direction": "row",
  border: "1px solid black",
  borderRadius: "4px",
  borderColor: "rgba(255, 255, 255, 0.81)",
};

type Advocate = {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
};

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const searchTermElement = document.getElementById(
      "search-term"
    ) as HTMLSpanElement;
    searchTermElement.innerHTML = value;

    const filteredAdvocates = advocates.filter((advocate: Advocate) => {
      const searchLower = value.toLowerCase();
      return Object.values(advocate).some((value) => {
        if (Array.isArray(value)) {
          return value.some((v) => v.toLowerCase().includes(searchLower));
        }
        return value.toString().toLowerCase().includes(searchLower);
      });
    });

    setFilteredAdvocates(value ? filteredAdvocates : advocates);
  };

  const onReset = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
    const searchTermElement = document.getElementById(
      "search-term"
    ) as HTMLSpanElement;
    const searchTermInputElement = document.getElementById(
      "search-term-input"
    ) as HTMLInputElement;
    searchTermElement.innerHTML = "";
    searchTermInputElement.value = "";
  };

  const onSearch = () => {
    setFilteredAdvocates(filteredAdvocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1 className="text-6xl font-bold font-[Mollie-Glaston] text-center mb-2">
        Solace Advocates
      </h1>
      <h2 className="text-2xl font-bold font-[Mollie-Glaston] text-center mb-2">
        Search for the Solace advocate that fits you best
      </h2>
      <br />
      <br />
      <div>
        <p>
          Searching for: <span id="search-term">{searchTerm}</span>
        </p>
        <div className="flex flex-row gap-2">
          <div className="flex items-center text-right w-[100px]">
            {filteredAdvocates.length} advocates
          </div>
          <div style={outerInputStyle}>
            <input
              type="text"
              style={inputStyle}
              onChange={onChange}
              id="search-term-input"
              placeholder="Search advocates"
            />
            <div>
              <button type="reset" style={buttonStyle} onClick={onReset}>
                <Image src="/cancel.svg" alt="cancel" width={24} height={24} />
              </button>
              <button type="submit" style={buttonStyle} onClick={onSearch}>
                <Image src="/search.svg" alt="cancel" width={24} height={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                First Name
              </th>
              <th scope="col" className="px-6 py-3">
                Last Name
              </th>
              <th scope="col" className="px-6 py-3">
                City
              </th>
              <th scope="col" className="px-6 py-3">
                Degree
              </th>
              <th scope="col" className="px-6 py-3">
                Specialties
              </th>
              <th scope="col" className="px-6 py-3">
                Years of Experience
              </th>
              <th scope="col" className="px-6 py-3">
                Phone Number
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate) => {
              return (
                <tr
                  key={`${advocate.firstName}-${advocate.lastName}`}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {advocate.firstName}
                  </th>
                  <td className="px-6 py-4">{advocate.lastName}</td>
                  <td className="px-6 py-4">{advocate.city}</td>
                  <td className="px-6 py-4">{advocate.degree}</td>
                  <td className="px-6 py-4">
                    {advocate.specialties.map((specialty, index) => (
                      <div key={`${specialty}-${index}`}>{specialty}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4">{advocate.yearsOfExperience}</td>
                  <td className="px-6 py-4">{advocate.phoneNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
