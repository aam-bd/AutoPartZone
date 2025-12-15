import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function RecommendationPage() {
  const { orderId } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [items, setItems] = useState([]);

  async function fetchRecommendations() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token"); // from login
      if (!token) {
        throw new Error("No token found. Please login first.");
      }

      const res = await fetch(`${API_BASE}/orders/recommendations/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load recommendations");
      }

      // backend returns: { orderId, recommendations: [...] }
      setItems(data?.recommendations || []);
    } catch (e) {
      setError(e.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (orderId) fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-900">Recommended Parts</h1>
        <p className="mt-1 text-sm text-gray-600">
          Order: <span className="font-mono">{orderId}</span>
        </p>

        <div className="mt-4 flex gap-2">
          <button
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            onClick={fetchRecommendations}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {loading && <div className="mt-4 text-sm text-gray-600">Loading...</div>}
        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {!loading && !error && items.length === 0 && (
            <div className="col-span-full rounded-xl bg-white p-6 text-sm text-gray-600 shadow">
              No recommendations found for this order.
            </div>
          )}

          {items.map((p) => (
            <div key={p._id} className="rounded-xl bg-white p-4 shadow">
              <h3 className="text-base font-semibold text-gray-900">{p.name}</h3>
              <p className="mt-1 text-xs text-gray-600">
                {p.brand} • {p.category}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm font-bold text-gray-900">৳ {p.price}</div>
                <div className="text-xs text-gray-600">Stock: {p.stock}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Note: this page requires JWT in localStorage as <span className="font-mono">token</span>.
        </div>
      </div>
    </div>
  );
}
