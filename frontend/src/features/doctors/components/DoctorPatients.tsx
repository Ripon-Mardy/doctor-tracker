"use client";

import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";

import { Pagination } from "@/components/shared/Pagination";
import { fetchPatients } from "@/lib/patients";
import type { PatientListResponse } from "@/types/patient";

const LIMIT = 10;

export function DoctorPatients({ doctorId }: { doctorId: string }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PatientListResponse | null>(null);
  const [error, setError] = useState("");
  const [loadedKey, setLoadedKey] = useState("");

  const requestKey = `${doctorId}|${page}`;
  const isLoading = loadedKey !== requestKey;

  useEffect(() => {
    let ignore = false;

    fetchPatients({
      search: "",
      condition: "",
      gender: "",
      doctor: doctorId,
      from: "",
      to: "",
      page,
      limit: LIMIT,
    })
      .then((res) => {
        if (ignore) return;
        setData(res);
        setError("");
        setLoadedKey(requestKey);
      })
      .catch((err: unknown) => {
        if (ignore) return;
        setError(err instanceof Error ? err.message : "Failed to load patients");
        setLoadedKey(requestKey);
      });

    return () => {
      ignore = true;
    };
  }, [doctorId, page, requestKey]);

  const patients = data?.patients ?? [];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-gray-900">Patients</h2>
        <p className="text-sm text-gray-500">Everyone currently assigned to this doctor.</p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : isLoading && !data ? (
        <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : patients.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center">
          <UserPlus className="h-8 w-8 text-gray-400" aria-hidden />
          <p className="mt-3 font-medium text-gray-900">No patients assigned</p>
          <p className="text-sm text-gray-500">This doctor doesn&apos;t have any patients yet.</p>
        </div>
      ) : (
        <>
          <div
            className={`overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm ${
              isLoading ? "opacity-60" : ""
            }`}
          >
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs font-medium tracking-wide text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">Gender</th>
                  <th className="px-4 py-3">Condition</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{patient.name}</td>
                    <td className="px-4 py-3 text-gray-500 tabular-nums">{patient.age}</td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{patient.gender}</td>
                    <td className="px-4 py-3 text-gray-500">{patient.condition}</td>
                    <td className="hidden px-4 py-3 text-gray-500 tabular-nums sm:table-cell">
                      {patient.phone}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data && (
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              total={data.pagination.total}
              limit={data.pagination.limit}
              onPageChange={setPage}
              itemLabel="patients"
            />
          )}
        </>
      )}
    </section>
  );
}
