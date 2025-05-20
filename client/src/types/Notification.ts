export interface Notification {
  notif_id: string; // Changed from id
  idno?: string;
  title: string;
  message: string;
  createdat: string;
  status: string;// Changed from read: boolean
  type: string;

}