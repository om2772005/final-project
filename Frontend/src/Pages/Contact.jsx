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

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 via-indigo-800 to-indigo-900 text-white pt-24 px-6 md:px-20 pb-16">
      {/* Heading */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-center mb-6"
        initial="hidden"
        animate="visible"
        custom={0}
        variants={fadeIn}
      >
        Get in Touch
      </motion.h1>

      <motion.p
        className="text-gray-300 text-center max-w-2xl mx-auto mb-12"
        initial="hidden"
        animate="visible"
        custom={1}
        variants={fadeIn}
      >
        Have a question, suggestion, or just want to say hello? Fill out the form below or email us directly — we’d love to hear from you.
      </motion.p>

      {/* Form Section */}
      <motion.form
        className="bg-white/10 backdrop-blur border border-white/10 p-8 rounded-2xl max-w-2xl mx-auto shadow-lg space-y-6"
        initial="hidden"
        animate="visible"
        custom={2}
        variants={fadeIn}
        onSubmit={(e) => {
          e.preventDefault();
          alert('Message submitted 🚀');
        }}
      >
        <div>
          <label className="block text-sm font-semibold mb-2">Name</label>
          <input
            type="text"
            required
            className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/20 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            required
            className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/20 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Message</label>
          <textarea
            rows="5"
            required
            className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/20 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Your Message"
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-yellow-400 text-indigo-900 font-bold py-3 rounded-lg transition hover:bg-yellow-300"
        >
          Send Message
        </motion.button>
      </motion.form>

      {/* Extra Info */}
      <motion.div
        className="mt-16 text-center text-sm text-gray-400"
        initial="hidden"
        animate="visible"
        custom={3}
        variants={fadeIn}
      >
        Or email us at{' '}
        <span className="text-yellow-300 underline cursor-pointer">
          support@trendycart.in
        </span>
      </motion.div>
    </div>
  );
};

export default Contact;
