import api from "@/lib/api";

export const aiService = {
  async extractText(text: string) {
    const response = await api.post("/ai/save", {
      text,
    });

    return response.data;
  },

  async uploadPDF(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/ai/pdf", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/ai/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  async uploadVoice(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/ai/voice", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};