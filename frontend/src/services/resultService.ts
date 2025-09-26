import api from './api';

export interface ProcessingResult {
    image_id: string;
    filename: string;
    status: 'completed' | 'processing' | 'failed';
    file_url: string;
    created_at: string;
    zones_result: {
        original_pdf_name?: string;
        [key: string]: any;
    };
    summary_pdf: string | null;
}

export interface ResultsResponse {
    results: ProcessingResult[];
}

export const resultService = {
    // Récupérer tous les résultats de l'utilisateur
    async getAllResults(): Promise<ResultsResponse> {
        const response = await api.get('/results/user/all');
        // Nettoyer et préparer les URLs
        const cleanedResults = response.data.results.map((result: ProcessingResult) => ({
            ...result,
            file_url: result.file_url ? `${result.file_url.replace(/\?$/, '')}?download=true` : null
        }));
        return { results: cleanedResults };
    },

    // Récupérer un résultat spécifique
    async getResult(imageId: string): Promise<ProcessingResult> {
        const response = await api.get(`/results/${imageId}`);
        return response.data;
    }
};