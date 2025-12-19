import React, { useState } from "react";
import axios from "axios";
import { User, FileText } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LoginPage = ({ onLogin }) => {
  const [passportNumber, setPassportNumber] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API}/login`, {
        passport_number: passportNumber,
        policy_number: policyNumber,
      });

      if (response.data.success) {
        onLogin(response.data.user);
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#C2E6F5' }}>
      {/* Header */}
      <header className="bg-orange-500 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-orange-500 rounded-full" />
          </div>
          <span className="text-white text-xl font-bold">Income Insurance</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Travel Insurance Claims
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Login to file or track your insurance claims
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchaser/Insured NRIC/ FIN/ Passport Number
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  placeholder="Enter your passport/NRIC number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Policy Number
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  placeholder="Enter your policy number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Test Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">Test Credentials (Customer):</p>
            <p className="text-sm text-gray-600">
              Passport: <code className="bg-blue-100 px-2 py-0.5 rounded text-blue-700">CSGHY654JK</code>
            </p>
            <p className="text-sm text-gray-600">
              Policy: <code className="bg-blue-100 px-2 py-0.5 rounded text-blue-700">TRV-2026-001487</code>
            </p>
          </div>
          
          {/* Customer Test Credentials */}
          <div className="mt-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">Test Credentials (Customer):</p>
            <p className="text-sm text-gray-600">
              Passport: <code className="bg-green-100 px-2 py-0.5 rounded text-green-700">CSGHY456JK</code>
            </p>
            <p className="text-sm text-gray-600">
              Policy: <code className="bg-green-100 px-2 py-0.5 rounded text-green-700">TRV-2026-001687</code>
            </p>
          </div>
          
          {/* New Test Credentials */}
          <div className="mt-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">Test Credentials (Mei Ling Chen):</p>
            <p className="text-sm text-gray-600">
              Passport: <code className="bg-purple-100 px-2 py-0.5 rounded text-purple-700">CSGHY623JK</code>
            </p>
            <p className="text-sm text-gray-600">
              Policy: <code className="bg-purple-100 px-2 py-0.5 rounded text-purple-700">INC-TRV-2024-79045</code>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-white/80 text-sm">
        © 2025 Income Insurance Limited. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
