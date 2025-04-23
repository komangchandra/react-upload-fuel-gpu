import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const api = process.env.REACT_APP_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah reload halaman

    try {
      const response = await axios.post(
        `${api}/login`,
        {
          email: `${email}@gmail.com`,
          password: password,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const name = response.data.user.name;

      if (response.data.token) {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("userEmail", email);
        sessionStorage.setItem("userName", name);
        sessionStorage.setItem("token", response.data.token);

        Swal.fire({
          title: "Berhasil Login!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate("/home");
      } else {
        Swal.fire({
          title: "Login Gagal!",
          text: response.data.message || "Email atau Password salah",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Login Gagal!",
        text: "Terjadi kesalahan, coba lagi.",
        icon: "error",
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg border-0 rounded-4"
        style={{ width: "350px", padding: "30px" }}
      >
        <h4 className="text-center fw-bold mb-3">LOGIN</h4>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="username"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin} className="btn btn-primary w-100">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
