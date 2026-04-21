export type AlertStatus =
  | "idle"
  | "checking"
  | "enabling"
  | "enabled"
  | "denied"
  | "unsupported"
  | "error";

export type StatusTone = "neutral" | "success" | "warning" | "danger";

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
  error?: string;
};
