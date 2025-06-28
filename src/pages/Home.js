import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Papa from "papaparse";
import axios from "axios";
import Swal from "sweetalert2";

const Home = () => {
  const [parsedData, setParsedData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const api = process.env.REACT_APP_API_URL;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data.map((row) => {
          const excelTimestamp = Number(row["Tanggal"]);
          const date = new Date(excelTimestamp);

          const formattedDatetime = `${date.getFullYear()}-${(
            date.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${date
            .getDate()
            .toString()
            .padStart(2, "0")} ${date
            .getHours()
            .toString()
            .padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${date
            .getSeconds()
            .toString()
            .padStart(2, "0")}`;

          return {
            datetime: formattedDatetime,
            hm: String(row["HM"]),
            vol: String(row["Volume"]),
            initial_flow: String(row["Flow Awal"]),
            final_flow: String(row["Flow Akhir"]),
            driver: String(row["Driver"]),
            location: String(row["Lokasi"]),
            username: String(row["Username"]),
            unit: String(row["Unit"]),
            no_lambung: String(row["Nomor Lambung"]),
            owner: String(row[" Owner"]),
            fuel_truck: String(row[" Fuel Truck"]),
          };
        });

        setParsedData(data);

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Berhasil upload, lakukan pengiriman segera",
        });
      },
    });
  };

  const handleSubmit = async () => {
    if (parsedData.length === 0) return;

    const result = await Swal.fire({
      title: "Yakin ingin mengirim data?",
      text: `Sebanyak ${parsedData.length} data akan dikirim.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Kirim",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    setIsUploading(true);

    Swal.fire({
      title: "Mengirim data...",
      text: "Mohon tunggu beberapa saat",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const chunkSize = 100;

    try {
      for (let i = 0; i < parsedData.length; i += chunkSize) {
        const chunk = parsedData.slice(i, i + chunkSize);

        const requests = chunk.map((payload) =>
          axios.post(`${api}/transactions`, payload, {
            headers: { "Content-Type": "application/json" },
          })
        );

        await Promise.all(requests);
      }

      Swal.fire({
        icon: "success",
        title: "Sukses!",
        text: "Semua data berhasil dikirim ke server.",
      });

      setParsedData([]);
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat mengirim data.",
      });
    } finally {
      setIsUploading(false);
    }

    // window.location.href  = "/home";
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Upload File</h2>
        <div className="my-3">
          <label className="form-label">
            Silahkan upload file CSV Fuel di sini
          </label>
          <input
            type="file"
            className="form-control"
            accept=".csv"
            onChange={handleFileUpload}
          />
        </div>

        {parsedData.length > 0 && (
          <div className="my-4">
            <p>Total data: {parsedData.length}</p>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isUploading}
            >
              {isUploading ? "Mengirim..." : "Kirim ke Server"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
