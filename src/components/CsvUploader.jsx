"use client";
import Papa from "papaparse";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function CsvUploader({ setData }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    if (!session) return; // Ensure user is logged in

    const file = event.target.files[0];
    if (!file) return;

    setLoading(true); // Start loading

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setData((prevData) => {
          const userEmail = session.user.email;
          const storedData = JSON.parse(
            localStorage.getItem(userEmail) || "[]"
          );

          // Prevent duplicate records (based on unique email in CSV)
          const newData = result.data.filter(
            (newRow) =>
              !storedData.some(
                (prevRow) => JSON.stringify(prevRow) === JSON.stringify(newRow)
              )
          );

          const updatedData = [...storedData, ...newData];

          localStorage.setItem(userEmail, JSON.stringify(updatedData));
          return updatedData;
        });

        setLoading(false); // Stop loading
        // Clear out the input after upload is complete
        event.target.value = "";
      },
    });
  };

  return (
    <>
      <div className="py-5 flex justify-center items-center gap-4 container mx-auto">
        <h6 className="text-lg font-semibold">Upload CSV File :</h6>
        <div className="relative w-fit group">
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="w-full max-w-96 px-4 py-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => document.getElementById("fileInput").click()}
            className="cursor-pointer absolute right-0 top-0 px-6 py-2 bg-blue-500 border text-white rounded-lg group-hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Upload
          </button>
        </div>
      </div>
      {loading && (
        <div className="container mx-auto flex justify-center items-center h-[calc(100vh-150px)]">
          <div className="loader animate-spin border-3 border-gray-200 border-t-blue-500 rounded-full w-12 h-12"></div>
        </div>
      )}
    </>
  );
}
