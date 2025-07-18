"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center px-4 transform -translate-y-20"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
          <span className="bg-gradient-to-r from-indigo-900 to-purple-700 bg-clip-text text-transparent">
            Grids & Circles
          </span>에
          <span className="block mt-2">오신 것을 환영합니다</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          최고의 원두와 향기를 경험하세요.
        </p>
      </motion.div>
    </section>
  );
}
