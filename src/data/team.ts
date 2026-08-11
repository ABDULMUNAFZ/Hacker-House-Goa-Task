export type TeamMember = {
  name: string;
  linkedin: string;
};

/**
 * Single source of truth for the footer credits.
 * Replace the `linkedin` values when the real profile URLs are supplied.
 */
export const TEAM_NAME = "TEAM TECH MAVERICKS";

export const teamMembers: TeamMember[] = [
  { name: "Team Member 01", linkedin: "https://www.linkedin.com/" },
  { name: "Team Member 02", linkedin: "https://www.linkedin.com/" },
  { name: "Team Member 03", linkedin: "https://www.linkedin.com/" },
];
