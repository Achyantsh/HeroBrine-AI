import api from "@/lib/api";
import { Commitment } from "@/types/commitment";

export const commitmentService = {
  async getAll(): Promise<Commitment[]> {
    const { data } = await api.get("/commitments");
    return data;
  },

  async getById(id: string): Promise<Commitment> {
    const { data } = await api.get(`/commitments/${id}`);
    return data;
  },

  async create(data: Partial<Commitment>) {
    const response = await api.post("/commitments", data);
    return response.data;
  },

  async update(id: string, data: Partial<Commitment>) {
    const response = await api.patch(`/commitments/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    await api.delete(`/commitments/${id}`);
  },

  async updateStatus(id: string, status: string) {
    const { data } = await api.patch(`/commitments/${id}`, { status });
    return data;
  },
};