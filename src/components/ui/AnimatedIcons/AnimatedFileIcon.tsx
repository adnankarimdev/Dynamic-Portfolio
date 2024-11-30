"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

export default function AnimatedFileText() {
  const [key, setKey] = useState(0);
  const controls = useAnimation();

  const iconVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.01 },
      },
    },
  };

  const lineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: (i: number) => ({
      scaleX: 1,
      opacity: 1,
      transition: {
        scaleX: { type: "spring", duration: 0.5, bounce: 0, delay: i * 0.1 },
        opacity: { duration: 0.01, delay: i * 0.1 },
      },
    }),
  };

  useEffect(() => {
    let mounted = true;

    const animateIcon = async () => {
      if (!mounted) return;

      await controls.start("visible");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (mounted) {
        await controls.start("hidden");
        setKey((prevKey) => prevKey + 1);
      }
    };

    animateIcon();

    return () => {
      mounted = false;
    };
  }, [controls, key]);

  return (
    <motion.svg
      key={key}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="url(#gradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial="hidden"
      animate={controls}
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#DB2777" />
        </linearGradient>
      </defs>
      <motion.path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        variants={iconVariants}
      />
      <motion.polyline points="14 2 14 8 20 8" variants={iconVariants} />
      <motion.line
        x1="16"
        y1="13"
        x2="8"
        y2="13"
        variants={lineVariants}
        custom={0}
      />
      <motion.line
        x1="16"
        y1="17"
        x2="8"
        y2="17"
        variants={lineVariants}
        custom={1}
      />
      <motion.polyline
        points="10 9 9 9 8 9"
        variants={lineVariants}
        custom={2}
      />
    </motion.svg>
  );
}
