import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100">
      <Navbar />

      <main className="max-w-md mx-auto py-12 px-6 text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">
          Welcome to Umbrella Auth
        </h1>
        <p className="text-gray-400 mb-6">
          Use the links below to test the password reset flow.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            to="/reset-password"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
          >
            🔁 Request Password Reset
          </Link>

          <Link
            to="/reset-password/confirm?token=EXAMPLE"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition"
          >
            🔐 Reset Password (with Token)
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          You can replace the token in the URL with a real one from your email.
        </p>
      </main>
    </div>
  );
};

export default HomePage;
