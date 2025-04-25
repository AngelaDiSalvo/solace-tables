"use client";

import { useEffect, useState } from "react";

const buttonStyle = {
  margin: "8px",
  border: "1px solid black",
  padding: "8px",
  borderRadius: "4px",
  cursor: "pointer",
};

const inputStyle = {
  margin: "8px",
  border: "1px solid black",
  padding: "8px",
  borderRadius: "4px",
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
  const [_, setSearchTerm] = useState<string>("");

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
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    const searchTermElement = document.getElementById(
      "search-term"
    ) as HTMLSpanElement;
    searchTermElement.innerHTML = searchTerm;

    const filteredAdvocates = advocates.filter((advocate: Advocate) => {
      const searchLower = searchTerm.toLowerCase();
      return Object.values(advocate).some((value) => {
        if (Array.isArray(value)) {
          return value.some((v) => v.toLowerCase().includes(searchLower));
        }
        return value.toString().toLowerCase().includes(searchLower);
      });
    });

    setFilteredAdvocates(searchTerm ? filteredAdvocates : advocates);
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
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input
          type="text"
          style={inputStyle}
          onChange={onChange}
          id="search-term-input"
        />
        <button type="reset" style={buttonStyle} onClick={onReset}>
          Reset
        </button>
        <button type="submit" style={buttonStyle} onClick={onSearch}>
          Search
        </button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr key={`${advocate.firstName}-${advocate.lastName}`}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((specialty, index) => (
                    <div key={`${specialty}-${index}`}>{specialty}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
