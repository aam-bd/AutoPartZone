import React, { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProductPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const limit = 10;

  // search filters
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");

  const isSearching = useMemo(() => {
    return Boolean(name.trim() || brand.trim() || category.trim());
  }, [name, brand, category]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / limit));
  }, [total, limit]);

  async function fetchProducts() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));

      let url = `${API_BASE}/products?${params.toString()}`;

      if (isSearching) {
        if (name.trim()) params.set("name", name.trim());
        if (brand.trim()) params.set("brand", brand.trim());
        if (category.trim()) params.set("category", category.trim());
        url = `${API_BASE}/products/search?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load products");
      }

      setProducts(data?.products || []);
      setTotal(data?.total || 0);
    } catch (e) {
      setError(e.message);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isSearching]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [name, brand, category]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="mt-1 text-sm text-gray-600">
          Browse auto parts, search by name/brand/category, and paginate.
        </p>

        {/* Filters */}
        <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-white p-4 shadow sm:grid-cols-4">
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring"
            placeholder="Search name (e.g., brake pad)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring"
            placeholder="Brand (exact match)"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring"
            placeholder="Category (exact match)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <button
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            onClick={() => fetchProducts()}
          >
            Search
          </button>

          {(name || brand || category) && (
            <button
              className="sm:col-span-4 rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setName("");
                setBrand("");
                setCategory("");
                setPage(1);
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Status */}
        {loading && <div className="mt-4 text-sm text-gray-600">Loading...</div>}
        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

        {/* Products grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {!loading && !error && products.length === 0 && (
            <div className="col-span-full rounded-xl bg-white p-6 text-sm text-gray-600 shadow">
              No products found.
            </div>
          )}

          {products.map((p) => (
            <div key={p._id} className="rounded-xl bg-white p-4 shadow">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{p.name}</h3>
                  <p className="mt-1 text-xs text-gray-600">
                    {p.brand} • {p.category}
                  </p>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  {p.isAvailable ? "Available" : "Hidden"}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm font-bold text-gray-900">৳ {p.price}</div>
                <div className="text-xs text-gray-600">Stock: {p.stock}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between rounded-xl bg-white p-4 shadow">
          <div className="text-sm text-gray-700">
            Page <span className="font-semibold">{page}</span> of{" "}
            <span className="font-semibold">{totalPages}</span> • Total{" "}
            <span className="font-semibold">{total}</span>
          </div>

          <div className="flex gap-2">
            <button
              className="rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-50"
              disabled={page <= 1 || loading}
              onClick={() => setPage((v) => Math.max(1, v - 1))}
            >
              Prev
            </button>
            <button
              className="rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-50"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((v) => Math.min(totalPages, v + 1))}
            >
              Next
            </button>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-4 text-xs text-gray-500">
          Backend base URL: <span className="font-mono">{API_BASE}</span> (set with <span className="font-mono">VITE_API_URL</span>)
        </div>
      </div>
    </div>
  );
}