export interface AuthUser {
  id: string;
  userId: string;
  refreshToken: string;
  expiresAt: Date;
  revokedAt: Date | null;
  userAgent: string | null;
  ip: string | null;
  deviceId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}
