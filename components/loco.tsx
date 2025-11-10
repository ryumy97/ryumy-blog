import { motion } from "motion/react";

export const AppearLeft = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 left-4 w-full max-h-[calc(100vh-2rem)]  max-w-2xs mx-auto"
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
};

export const AppearBottom = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 w-fit max-w-[calc(100vw-2rem)] mx-auto"
      initial={{ y: "calc(100% + 2rem)" }}
      animate={{ y: 0 }}
      exit={{ y: "calc(100% + 2rem)" }}
    >
      {children}
    </motion.div>
  );
};
