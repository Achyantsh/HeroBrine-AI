"use client";

import { useEffect, useState } from "react";
import { Commitment } from "@/types/commitment";
import { commitmentService } from "@/services/commitmentService";

export function useCommitments() {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchCommitments() {
    try {
      setLoading(true);

      const data = await commitmentService.getAll();

      setCommitments(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load commitments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCommitments();
  }, []);

  return {
    commitments,
    loading,
    error,
    refresh: fetchCommitments,
  };
}