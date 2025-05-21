// src/pages/HomePage.jsx
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Home Page</h1>
        <p className="mb-4">
          Use the links below to test password reset flows:
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/reset-password"
            className="bg-blue-600 text-white px-4 py-2 rounded text-center"
          >
            🔁 Request Password Reset
          </Link>

          <Link
            to="/reset-password/confirm?token=EXAMPLE"
            className="bg-green-600 text-white px-4 py-2 rounded text-center"
          >
            🔐 Reset Password (with token)
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
