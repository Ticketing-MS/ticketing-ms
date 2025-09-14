import { Role, Team } from "lib/db/models";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
  role: Role | undefined;
  auth?: {
    accessToken: string;
    refreshToken: string;
    deviceId: string;
  };
  teams: Team[];
}
