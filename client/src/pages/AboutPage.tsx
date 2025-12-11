import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { pageVariants, pageTransition } from '../animations';
import SiteHead from '../components/SiteHead';
import PageHeader from '../components/PageHeader';
import Mission from '../components/Mission';
import OurProcess from '../components/OurProcess';
import { ChevronRight, Mail, Phone, Linkedin } from 'lucide-react';
import { teamMembers } from '../services/TEAM_MEMBERS_DATA';
import api from '../services/api';

interface TeamMember {
  id?: number;
  name: string;
  role: string;
  roleLabel?: string;
  image: string;
  email: string | null;
  phone: string | null;
  linkedin?: string;
}

const AboutPage: React.FC = () => {
  const [numCols, setNumCols] = useState(3);
  const [apiTeamMembers, setApiTeamMembers] = useState<TeamMember[]>([]);
  const [useApiData, setUseApiData] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await api.get('/team');
        if (response.data && response.data.length > 0) {
          const formattedMembers = response.data.map((member: any) => ({
            ...member,
            roleLabel: member.role_label || member.role,
          }));
          setApiTeamMembers(formattedMembers);
          setUseApiData(true);
        }
      } catch (err) {
        console.error('Failed to fetch team members:', err);
        // Fall back to static data
        setUseApiData(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const displayMembers = useApiData ? apiTeamMembers : teamMembers;

  useEffect(() => {
    const handleResize = () => {
      // Use ResizeObserver for better performance and avoid forced reflows
      const updateColumns = () => {
        const viewportWidth = window.innerWidth;
        if (viewportWidth >= 1024) {
          setNumCols(3); // Large screens - 3 columns
        } else if (viewportWidth >= 768) {
          setNumCols(2); // Medium screens - 2 columns  
        } else {
          setNumCols(1); // Small screens - 1 column
        }
      };
      updateColumns();
    };
    
    // Use ResizeObserver if available, fallback to window resize
    if (window.ResizeObserver) {
      const grid = document.querySelector('.team-grid');
      if (grid) {
        const resizeObserver = new ResizeObserver(() => {
          const viewportWidth = window.innerWidth;
          if (viewportWidth >= 1024) {
            setNumCols(3);
          } else if (viewportWidth >= 768) {
            setNumCols(2);
          } else {
            setNumCols(1);
          }
        });
        resizeObserver.observe(grid);
        return () => resizeObserver.disconnect();
      }
    } else {
      // Fallback for older browsers
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const placeholdersNeeded = numCols > 0 ? (numCols - (displayMembers.length % numCols)) % numCols : 0;
  const displayItems = [...displayMembers, ...Array(placeholdersNeeded).fill(null)];

  return (
    <>
      <SiteHead 
        title="About Us"
        description="Meet the ClickBit team - passionate experts delivering customized IT solutions. Learn about our mission to empower businesses with innovative digital strategies."
      />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
      <div className="bg-white dark:bg-gray-900">
        <PageHeader 
          title="About Us"
          breadcrumbs={[
            { name: 'Home', href: '/' },
            { name: 'About Us', href: '/about' }
          ]}
        />
        <div className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Unleashing the Potential of <br />
                <span className="text-[#1FBBD2]">Your Business</span> Utilizing Intelligent Solutions
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Left Card */}
              <div className="lg:col-span-2 bg-green-100 dark:bg-green-900/20 text-gray-800 dark:text-gray-200 rounded-3xl p-8 md:p-12 h-full relative overflow-hidden">
                  <div 
                      className="absolute inset-0 bg-no-repeat bg-bottom"
                      style={{ backgroundImage: `url('/images/patterns/wavy-pattern.svg')`}}
                  ></div>
                  <div className="relative">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Customised Solution</h3>
                      <p className="text-lg">
                          No two businesses are the same, and your IT solutions shouldn't be either. We take the time to get to know your company, its goals, and its challenges, so we can create custom strategies that fit you perfectly. <Link to="/services" className="text-[#1FBBD2] hover:text-[#1A9DAA] font-semibold underline">Learn more about our services</Link> and how we support startups and small business growth.
                      </p>
                  </div>
              </div>
              {/* Right Card */}
              <div className="bg-yellow-100 dark:bg-yellow-900/20 text-gray-800 dark:text-gray-200 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                  <div 
                      className="absolute inset-0 bg-no-repeat bg-center"
                      style={{ backgroundImage: `url('/images/patterns/circle-pattern.svg')`}}
                  ></div>
                  <div className="relative">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Start to Finish Support</h3>
                      <p className="text-7xl font-bold text-yellow-500 dark:text-yellow-400 my-4">9+</p>
                      <p className="text-lg font-semibold">Happy Clients</p>
                  </div>
              </div>
            </div>
          </div>
        </div>

        <Mission />
        <OurProcess />

        {/* Team Section */}
        <div className="bg-gray-100 dark:bg-transparent py-16 md:py-24">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-gray-500 dark:text-gray-400 mb-2">/ team /</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-8 text-gray-900 dark:text-white">
                The ClickBIT Experts: <br />
                uniting talent for <span className="bg-gradient-to-r from-[#1FBBD2] to-[#F39C12] text-transparent bg-clip-text">intelligent solutions</span>
              </h2>
              <div>
                <span className="text-yellow-500 dark:text-yellow-400 text-6xl md:text-7xl font-bold">10+</span>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Awesome team members</p>
              </div>
            </div>
            
            {/* Team Cards Grid */}
            <div className="team-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayItems.map((member, index) => (
                member ? (
                  <motion.div
                    key={member.name} 
                    className={`bg-white dark:bg-[#1C1C1C] rounded-3xl p-4 flex flex-col group shadow-lg dark:shadow-2xl ${
                      index % 2 !== 0 ? 'lg:mt-12' : ''
                    }`}
                  >
                    <div className="relative overflow-hidden rounded-2xl border-4 border-white dark:border-[#1C1C1C] group/image aspect-[4/5]">
                      <img 
                        src={member.image} 
                        alt={`Portrait of ${member.name}`} 
                        className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-300"
                        style={{ objectPosition: member.name === 'Kauser Ahmed' ? '50% 10%' : 'center' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Role Label */}
                      <div className="absolute top-0 right-0 bottom-0 flex items-center pr-2">
                        <p className="text-white font-bold uppercase [writing-mode:vertical-rl] transform rotate-180 tracking-widest text-lg opacity-75">
                          {member.roleLabel}
                        </p>
                      </div>

                      {/* Contact overlay */}
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover/image:opacity-100 transition-all duration-300 p-4 text-center">
                        <div className="space-y-4">
                          <a href={`mailto:${member.email}`} className="flex items-center text-white font-semibold tracking-wider text-lg hover:text-cyan-400 transition-colors">
                            <Mail className="w-5 h-5 mr-3" />
                            <span>{member.email}</span>
                          </a>
                          {member.phone && (
                            <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="flex items-center text-white font-semibold tracking-wider text-lg hover:text-cyan-400 transition-colors">
                              <Phone className="w-5 h-5 mr-3" />
                              <span>{member.phone}</span>
                            </a>
                          )}
                          {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-white font-semibold tracking-wider text-lg hover:text-cyan-400 transition-colors">
                              <Linkedin className="w-5 h-5 mr-3" />
                              <span>LinkedIn</span>
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {/* Button - visual only */}
                      <div className="absolute bottom-4 left-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center cursor-pointer group-hover/image:opacity-0 transition-opacity duration-300">
                        <ChevronRight className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="pt-4 text-left">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{member.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">/ {member.role} /</p>
                    </div>
                  </motion.div>
                ) : (
                  <div key={`placeholder-${index}`} /> // Render an empty div for placeholders
                )
              ))}
            </div>
          </div>
        </div>
      </div>
      </motion.div>
    </>
  );
};

export default AboutPage; 