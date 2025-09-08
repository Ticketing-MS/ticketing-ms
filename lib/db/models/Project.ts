export interface Project {
  id: string;
  teamId: string | null;
  name: string;
  slug: string;
  description: string | null;
  createdBy: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}
