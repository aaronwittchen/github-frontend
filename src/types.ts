// src/types.ts

export interface Repository {
  name: string;
  description: string | null;
  htmlUrl: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  languages?: Array<{
    name: string;
    percentage: number;
  }>;
  updatedAt: string;
  lastCommitDate?: string;
  createdAt?: string;
  isPrivate?: boolean;
  owner?: {
    login: string;
    htmlUrl: string;
  };
}

export interface Commit {
  message: string;
  url: string;
  sha: string;
  date: string;
}

export interface ContributionWeek {
  contributionDays: Array<{
    date: string;
    count: number;
  }>;
}

export interface User {
  username: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  githubUrl: string;
  location?: string;
  company?: string;
  blog?: string;
  followers: number;
  following: number;
  publicRepos: number;
  topRepositories: Repository[];
  languages?: Array<{ name: string; percentage: number }>;
  lastCommit?: Commit;
  contributions?: {
    weeks: ContributionWeek[];
  };
}

export interface StarRange {
  label: string;
  min: number;
  max: number;
}
