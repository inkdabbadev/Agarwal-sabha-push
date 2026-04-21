export type AlertStatus =
  | "idle"
  | "checking"
  | "enabling"
  | "enabled"
  | "needs-install"
  | "denied"
  | "unsupported"
  | "error";

export type StatusTone = "neutral" | "success" | "warning" | "danger";

export type Announcement = {
  id: string;
  title: string;
  message: string;
  link: string | null;
  created_at: string;
};

export type NotificationFormState = {
  title: string;
  message: string;
  link: string;
  password: string;
};

export type SendNotificationResult = {
  ok: boolean;
  sent: number;
  failed: number;
  invalidated?: number;
  announcementId?: string;
  error?: string;
};
