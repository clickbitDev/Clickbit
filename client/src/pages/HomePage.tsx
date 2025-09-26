import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../animations';
import SiteHead from '../components/SiteHead';

import Hero from '../components/Hero';
import Services from '../components/Services';
import Mission from '../components/Mission';
import OurProcess from '../components/OurProcess';
import FeaturedWork from '../components/FeaturedWork';
import Testimonials from '../components/Testimonials';
import StatsGrid from '../components/StatsGrid';
import DynamicRibbon from '../components/DynamicRibbon';
import ShowcaseGrid from '../components/ShowcaseGrid';
import CTA from '../components/CTA';

const HomePage = () => {
  return (
    <>
      <SiteHead 
        title="ClickBIT Home"
        description="Empowering businesses with innovative digital solutions to connect, engage, and grow. Expert web development, custom applications, and IT support services."
      />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
      <Hero />
      <ShowcaseGrid />
      <DynamicRibbon />
      <Services />
      <StatsGrid />
      <Mission />
      <OurProcess />
      <FeaturedWork />
      <Testimonials />
      <CTA />
      </motion.div>
    </>
  );
};

export default HomePage;