import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';
// Import specific Lucide React icons for each deliverable and phase
import {
  ClipboardList, // Main icon for Planning phase
  Palette,       // Main icon for Design phase
  CheckCircle,   // Main icon for Testing phase
  Rocket,        // Main icon for Launch phase
  FileText,      // Deliverable: Document
  Users,         // Deliverable: Stakeholders
  ClipboardCheck, // Deliverable: Requirements
  Calendar,      // Deliverable: Schedule/Plan
  ShieldAlert,   // Deliverable: Risk
  Network,       // Deliverable: Architecture
  Layout,        // Deliverable: UI/UX Mockups
  Code,          // Deliverable: Modules/Components
  TestTube,      // Deliverable: Unit Test Cases
  Package,       // Deliverable: Integrated System
  CheckSquare,   // Deliverable: Comprehensive Test
  Signature,     // Deliverable: UAT Sign-off
  BarChart2,     // Deliverable: Reports (Performance/Security)
  Upload,        // Deliverable: Deployment
  Book,          // Deliverable: Manuals
  Zap,           // Deliverable: Go-Live
  LifeBuoy       // Deliverable: Support
} from 'lucide-react';

// Icon mapping for dynamic icon loading
const iconMap: { [key: string]: React.ComponentType<any> } = {
  ClipboardList,
  Palette,
  CheckCircle,
  Rocket,
  FileText,
  Users,
  ClipboardCheck,
  Calendar,
  ShieldAlert,
  Network,
  Layout,
  Code,
  TestTube,
  Package,
  CheckSquare,
  Signature,
  BarChart2,
  Upload,
  Book,
  Zap,
  LifeBuoy
};

const OurProcess: React.FC = () => {
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const { getContent, processPhases } = useContent();
  
  // Get dynamic content with fallbacks
  const processTitle = getContent('home', 'process', 'title') || 'Our Path to';
  const processHighlight = getContent('home', 'process', 'highlight') || 'Your Success';
  const processDescription = getContent('home', 'process', 'description') || 'A transparent and collaborative process designed for results. We follow a structured four-phase approach to ensure quality and clarity from start to finish.';

  // Default process phases as fallback
  const defaultProcessPhases = [
    {
      id: 1,
      mainIcon: 'ClipboardList',
      title: 'Planning',
      subtitle: '& Requirements',
      description: 'We define the project\'s scope, goals, and foundational needs, aligning expectations for a clear roadmap ahead.',
      color: 'text-[#1FBBD2]',
      bgColor: 'hover:bg-cyan-50',
      darkBgColor: 'dark:hover:bg-cyan-900/20',
      deliverables: [
        { text: 'Detailed Project Scope Document', icon: 'FileText' },
        { text: 'Stakeholder Register', icon: 'Users' },
        { text: 'User & Technical Requirements', icon: 'ClipboardCheck' },
        { text: 'Draft Project Plan & Schedule', icon: 'Calendar' },
        { text: 'Initial Risk Assessment', icon: 'ShieldAlert' },
      ]
    },
    {
      id: 2,
      mainIcon: 'Palette',
      title: 'Design',
      subtitle: '& Development',
      description: 'Transforming concepts into functional realities, we craft user-centric designs and build robust, scalable solutions.',
      color: 'text-[#F39C12]',
      bgColor: 'hover:bg-amber-50',
      darkBgColor: 'dark:hover:bg-amber-900/20',
      deliverables: [
        { text: 'System Architecture Design', icon: 'Network' },
        { text: 'UI/UX Mockups & Prototypes', icon: 'Layout' },
        { text: 'Alpha Version of Modules/Components', icon: 'Code' },
        { text: 'Unit Test Cases', icon: 'TestTube' },
      ]
    },
    {
      id: 3,
      mainIcon: 'CheckCircle',
      title: 'Testing',
      subtitle: '& Quality Assurance',
      description: 'Rigorous testing ensures every component functions flawlessly, delivering a high-quality, reliable product ready for deployment.',
      color: 'text-emerald-500',
      bgColor: 'hover:bg-emerald-50',
      darkBgColor: 'dark:hover:bg-emerald-900/20',
      deliverables: [
        { text: 'Integrated System (Beta Version)', icon: 'Package' },
        { text: 'Comprehensive Test Plan & Cases', icon: 'CheckSquare' },
        { text: 'User Acceptance Testing (UAT) Sign-off', icon: 'Signature' },
        { text: 'Performance & Security Reports', icon: 'BarChart2' },
      ]
    },
    {
      id: 4,
      mainIcon: 'Rocket',
      title: 'Launch',
      subtitle: '& Deployment',
      description: 'The culmination of our efforts: successful system deployment, user empowerment, and dedicated post-launch support.',
      color: 'text-rose-500',
      bgColor: 'hover:bg-rose-50',
      darkBgColor: 'dark:hover:bg-rose-900/20',
      deliverables: [
        { text: 'Deployment Plan', icon: 'Upload' },
        { text: 'User Manuals & Training Materials', icon: 'Book' },
        { text: 'System Go-Live', icon: 'Zap' },
        { text: 'Post-Launch Support Plan', icon: 'LifeBuoy' },
      ]
    },
  ];

  const displayProcessPhases = processPhases.length > 0 ? processPhases : defaultProcessPhases;

  const handleInteraction = (phaseId: number | null) => {
    // On touch devices, this will be sticky. On hover devices, this is transient.
    setActivePhase(phaseId);
  };

  const handleClick = (phaseId: number) => {
    // Allows for toggling on touch devices
    setActivePhase(prev => prev === phaseId ? null : phaseId);
  }

  return (
    <section className="bg-white dark:bg-gray-900 py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 px-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white">
            {processTitle} <span className="bg-gradient-to-r from-[#1FBBD2] to-[#F39C12] text-transparent bg-clip-text">{processHighlight}</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {processDescription}
          </p>
        </div>

        {/* 2x2 Grid Layout for Phases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayProcessPhases.map((phase) => {
            const MainIconComponent = iconMap[phase.mainIcon] || ClipboardList;
            return (
              <motion.div
                key={phase.id}
                className={`relative p-8 rounded-2xl shadow-lg border border-gray-200/80 dark:border-gray-700/60 overflow-hidden cursor-pointer transition-all duration-500 ease-out transform hover:shadow-2xl hover:scale-[1.02] ${phase.bgColor} ${phase.darkBgColor}`}
                onHoverStart={() => handleInteraction(phase.id)}
                onHoverEnd={() => handleInteraction(null)}
                onClick={() => handleClick(phase.id)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: phase.id * 0.15, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.4 }}
              >
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center mb-6">
                    <div className={`text-white p-3 rounded-full bg-gray-800 dark:bg-gray-900 inline-flex items-center justify-center shadow-md mr-5 ${phase.color}`}>
                      <MainIconComponent size={28} strokeWidth={2.5} className="text-white" />
                    </div>
                    <div>
                      <span className={`text-sm font-semibold block ${phase.color}`}>{`Phase ${phase.id}`}</span>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white leading-tight">
                        {phase.title}
                        <span className="text-xl font-semibold opacity-80"> {phase.subtitle}</span>
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-base mb-6 flex-grow">{phase.description}</p>

                  <AnimatePresence>
                    {activePhase === phase.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <h4 className="text-lg font-bold mt-4 mb-3 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-4">Key Deliverables:</h4>
                        <ul className="flex flex-wrap gap-2 text-sm font-medium">
                          {phase.deliverables.map((item, i) => {
                            const DeliverableIconComponent = iconMap[item.icon] || FileText;
                            return (
                              <motion.li
                                key={i}
                                className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5 text-gray-700 dark:text-gray-300 shadow-sm"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                              >
                                <DeliverableIconComponent size={16} className={`mr-2 ${phase.color}`} />
                                <span>{item.text}</span>
                              </motion.li>
                            );
                          })}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurProcess;