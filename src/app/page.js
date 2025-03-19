"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AuthButton from "../components/AuthButton";
import CsvUploader from "../components/CsvUploader";
import DataTable from "../components/DataTable";

export default function Home() {
  const { data: session } = useSession();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (session) {
      const userEmail = session.user.email;
      const savedData = JSON.parse(localStorage.getItem(userEmail) || "[]");
      setData(savedData);
    }
  }, [session]);

  return (
    <div>
      <AuthButton />
      {!session ? (
        <div className="h-[calc(100dvh-4rem)] flex items-center justify-center">
          <h1 className="text-5xl font-bold">Sign in to view your data</h1>
        </div>
      ) : (
        <>
          <CsvUploader setData={setData} />
          <DataTable data={data} />
        </>
      )}
    </div>
  );
}
