import React from "react";
import { motion } from "framer-motion";
import { Shield, User } from "lucide-react";

const Header = ({ isLive, passengerName }) => {
  return (
    <header className="app-header" data-testid="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="income-logo" data-testid="income-logo">
            <img 
              src="https://customer-assets.emergentagent.com/job_luggage-tracker-4/artifacts/lyzf6y27_image.png" 
              alt="Income Insurance" 
              className="h-10 w-auto"
            />
          </div>

          {/* Center - Title */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-white/90 text-sm font-medium">
              Agentic Claims Platform
            </span>
            {isLive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="live-indicator"
                data-testid="live-indicator"
              >
                <span className="live-dot" />
                <span>LIVE</span>
              </motion.div>
            )}
          </div>

          {/* Right - User Info */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-white text-sm font-medium">{passengerName}</p>
              <p className="text-white/70 text-xs">Policyholder</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center" data-testid="user-avatar">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
