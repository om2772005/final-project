import React from 'react';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 via-indigo-700 to-indigo-900 text-white pt-24 px-6 md:px-20 pb-16">
      {/* Header */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-center mb-12 text-white"
        initial="hidden"
        animate="visible"
        custom={0}
        variants={fadeIn}
      >
        About TrendyCart
      </motion.h1>

      {/* Intro */}
      <motion.p
        className="text-lg md:text-xl text-center max-w-4xl mx-auto text-gray-200 mb-12"
        initial="hidden"
        animate="visible"
        custom={1}
        variants={fadeIn}
      >
        TrendyCart isn’t just another online store. We’re a destination for fashion-forward shoppers who crave quality, affordability, and a seamless shopping experience.
      </motion.p>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          {
            title: 'High-Quality Products',
            desc: 'Every item on TrendyCart is handpicked and tested for premium quality and durability.',
          },
          {
            title: 'Lightning-Fast Delivery',
            desc: 'We deliver across India with top logistics partners to ensure speed and safety.',
          },
          {
            title: 'Customer Obsessed',
            desc: 'Your satisfaction drives us. 24/7 support, easy returns, and loyalty rewards await you.',
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="bg-white/10 p-6 rounded-xl shadow-md backdrop-blur border border-white/10"
            initial="hidden"
            animate="visible"
            custom={i + 2}
            variants={fadeIn}
          >
            <h3 className="text-xl font-semibold text-yellow-300 mb-2">{item.title}</h3>
            <p className="text-gray-200">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Final CTA */}
      <motion.div
        className="mt-20 text-center max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        custom={6}
        variants={fadeIn}
      >
        <h2 className="text-2xl font-bold text-white mb-4">Join the Trendy Movement</h2>
        <p className="text-gray-300">
          With over <span className="text-yellow-300 font-medium">50,000+</span> satisfied customers, we’re on a mission to bring style to every doorstep. Be bold. Be Trendy.
        </p>
      </motion.div>
    </div>
  );
};

export default About;
