import { Mail, Phone } from 'lucide-react';

export interface TeamMember {
  name: string;
  role: string;
  roleLabel: string;
  image: string;
  email: string | null;
  phone: string | null;
}

export const teamMembers: TeamMember[] = [
    { name: 'Kauser Ahmed', role: 'Digital Guardian', roleLabel: 'Guardian', image: '/images/team/kauser-ahmed.jpg', email: 'methel@clickbit.com.au', phone: '+61 480 228 744' },
    { name: 'Sanjida Parvin', role: 'HR & Accounts', roleLabel: 'Strategist', image: '/images/team/sanjida-parvin.png', email: 'sanjida@clickbit.com.au', phone: null },
    { name: 'Rafiqul Islam', role: 'Front-End Alchemist', roleLabel: 'Creator', image: '/images/team/rafiqul-islam.png', email: 'rafiqul@clickbit.com.au', phone: null },
    { name: 'Farhan Bin Matin', role: 'Organic Growth Engineer', roleLabel: 'Optimizer', image: '/images/team/farhan-bin-matin.png', email: 'farhan@clickbit.com.au', phone: '+61 422 512 130' },
    { name: 'Azwad Bhuiyan', role: 'Technical Specialist', roleLabel: 'Specialist', image: '/images/team/azwad-bhuiyan.png', email: 'azwad@clickbit.com.au', phone: '+61 401 222 838' },
    { name: 'Talha Zubaer', role: 'Backend Developer', roleLabel: 'Developer', image: '/images/team/talha-zubaer.png', email: 'zubaer@clickbit.com.au', phone: '+61 452 624 857' },
]; 