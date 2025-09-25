import api from './api';

export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    result_id?: string;
    pdf_url?: string;
    created_at: string;
    read: boolean;
}

export const notificationService = {
    // Récupérer toutes les notifications
    async getNotifications(): Promise<Notification[]> {
        const response = await api.get('/notifications');
        return response.data;
    },

    // Marquer une notification comme lue
    async markAsRead(notificationId: string): Promise<void> {
        await api.post(`/notifications/${notificationId}/read`);
    },

    // Supprimer une notification
    async deleteNotification(notificationId: string): Promise<void> {
        await api.delete(`/notifications/${notificationId}`);
    },

    // Récupérer le nombre de notifications non lues
    async getUnreadCount(): Promise<number> {
        const notifications = await this.getNotifications();
        return notifications.filter(n => !n.read).length;
    }
};