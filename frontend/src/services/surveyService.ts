// frontend/src/services/surveyService.ts
import ApiService from './api';
import { Survey, UploadResponse } from '../types';

class SurveyService {
  // Récupérer tous les levés de l'utilisateur
  async getUserSurveys(): Promise<Survey[]> {
    const response = await ApiService.get<Survey[]>('/api/surveys');
    return response.success ? response.data || [] : [];
  }

  // Récupérer un levé spécifique
  async getSurvey(id: string): Promise<Survey | null> {
    const response = await ApiService.get<Survey>(`/api/surveys/${id}`);
    return response.success ? response.data || null : null;
  }

  // Upload d'un nouveau levé
  async uploadSurvey(file: File, title: string, description?: string): Promise<UploadResponse | null> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    if (description) formData.append('description', description);

    try {
      const response = await fetch('http://localhost:8080/api/surveys/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  }

  // Supprimer un levé
  async deleteSurvey(id: string): Promise<boolean> {
    const response = await ApiService.delete(`/api/surveys/${id}`);
    return response.success;
  }
}

export default new SurveyService();