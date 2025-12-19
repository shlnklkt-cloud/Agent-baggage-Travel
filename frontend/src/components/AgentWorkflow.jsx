import React, { useEffect, useRef, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import {
  Bot,
  Zap,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Server,
  ArrowRight,
  Shield,
  CreditCard,
  DollarSign,
  CloudLightning,
  Plane,
  FileText,
  ShieldCheck,
  Calculator,
  UserCheck,
} from "lucide-react";

const AGENT_CONFIG = {
  orchestrator: {
    name: "Orchestrator Agent",
    color: "bg-blue-500",
    borderColor: "border-blue-500",
    textColor: "text-blue-600",
    bgLight: "bg-blue-50",
    icon: Bot,
    avatar: "https://images.pexels.com/photos/8832762/pexels-photo-8832762.jpeg",
  },
  claims: {
    name: "Claims Processing Agent",
    color: "bg-[#F96302]",
    borderColor: "border-[#F96302]",
    textColor: "text-[#F96302]",
    bgLight: "bg-orange-50",
    icon: FileText,
    avatar: "https://images.pexels.com/photos/8832738/pexels-photo-8832738.jpeg",
  },
  payment: {
    name: "Payment Agent",
    color: "bg-green-500",
    borderColor: "border-green-500",
    textColor: "text-green-600",
    bgLight: "bg-green-50",
    icon: CreditCard,
    avatar: "https://images.pexels.com/photos/8832716/pexels-photo-8832716.jpeg",
  },
};

const VALIDATION_ICONS = {
  1: FileText,
  2: Plane,
  3: CloudLightning,
  4: ShieldCheck,
  5: Calculator,
  6: UserCheck,
};

const AgentWorkflow = forwardRef(({ messages, currentPhase, workflowStarted }, ref) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const renderMessage = (message, index) => {
    const delay = index * 0.1;

    switch (message.type) {
      case "system":
        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            className="flex justify-center my-4"
          >
            <div className="message-bubble-system px-6 py-3 rounded-full" data-testid={`system-message-${index}`}>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#F96302]" />
                <span className="text-sm font-semibold text-slate-700">{message.content}</span>
              </div>
            </div>
          </motion.div>
        );

      case "agent":
        const agentConfig = AGENT_CONFIG[message.agent];
        const AgentIcon = agentConfig.icon;
        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className="flex items-start gap-3 my-4"
            data-testid={`agent-message-${index}`}
          >
            <div className="relative">
              <img
                src={agentConfig.avatar}
                alt={agentConfig.name}
                className={`agent-avatar agent-avatar-${message.agent}`}
              />
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${agentConfig.color} rounded-full flex items-center justify-center`}>
                <AgentIcon className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-sm font-semibold ${agentConfig.textColor}`}>
                  {agentConfig.name}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className={`message-bubble message-bubble-agent ${message.highlight ? `border-l-4 ${agentConfig.borderColor}` : ""}`}>
                <p className="text-sm text-slate-700 leading-relaxed">{message.content}</p>
              </div>
            </div>
          </motion.div>
        );

      case "api-call":
        const apiAgentConfig = AGENT_CONFIG[message.agent];
        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="flex items-start gap-3 my-3 ml-12"
            data-testid={`api-call-${index}`}
          >
            <div className="flex-1">
              <div className="api-call-indicator">
                <Server className="w-4 h-4" />
                <span className="font-medium">Calling API:</span>
                <span className="text-blue-700">{message.apiName}</span>
                <ArrowRight className="w-4 h-4" />
                <code className="text-xs bg-blue-100 px-2 py-0.5 rounded">{message.endpoint}</code>
                <Loader2 className="w-4 h-4 animate-spin ml-auto" />
              </div>
            </div>
          </motion.div>
        );

      case "api-response":
        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="flex items-start gap-3 my-3 ml-12"
            data-testid={`api-response-${index}`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  {message.apiName} responded successfully
                </span>
              </div>
            </div>
          </motion.div>
        );

      case "validation":
        const ValidationIcon = VALIDATION_ICONS[message.step] || Shield;
        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="my-3 ml-12"
            data-testid={`validation-${message.step}-${message.status}`}
          >
            <div className={`validation-card ${message.status}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    message.status === "passed" ? "bg-green-100" :
                    message.status === "processing" ? "bg-amber-100" : "bg-red-100"
                  }`}>
                    {message.status === "processing" ? (
                      <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                    ) : message.status === "passed" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {message.name}
                    </p>
                    {message.status === "processing" && (
                      <p className="text-xs text-amber-600">Validating...</p>
                    )}
                  </div>
                </div>
                <Badge className={`${
                  message.status === "passed" ? "bg-green-100 text-green-700" :
                  message.status === "processing" ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {message.status.toUpperCase()}
                </Badge>
              </div>
              {message.details && (
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{message.details}</p>
              )}
              {message.compensation && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                >
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Calculated Compensation</p>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-sm text-slate-600">Base: ${message.compensation.base.toFixed(2)}</span>
                      <span className="text-slate-400">+</span>
                      <span className="text-sm text-slate-600">Inconvenience: ${message.compensation.inconvenience.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <DollarSign className="w-6 h-6 text-green-600" />
                      <span className="compensation-amount">${message.compensation.total.toFixed(2)}</span>
                      <span className="text-slate-500">{message.compensation.currency}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        );

      case "error":
        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="flex justify-center my-4"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">{message.content}</span>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="glass-card h-[calc(100vh-180px)] flex flex-col" data-testid="agent-workflow-panel">
      <CardHeader className="border-b border-slate-200/50 pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-outfit text-slate-800">
            <Bot className="w-5 h-5 text-[#F96302]" />
            Agent Workflow Stream
          </div>
          <div className="flex items-center gap-2">
            {currentPhase !== "idle" && (
              <Badge className={`${
                currentPhase === "complete" ? "bg-green-100 text-green-700" :
                "bg-blue-100 text-blue-700"
              }`}>
                {currentPhase === "detection" && "Detection Phase"}
                {currentPhase === "claims" && "Claims Processing"}
                {currentPhase === "payment" && "Payment Processing"}
                {currentPhase === "complete" && "Complete"}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="p-4">
            {!workflowStarted ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-slate-500">
                <Bot className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-medium mb-2">No-Touch Claims Demo</p>
                <p className="text-sm text-center max-w-md">
                  Click "Start No-Touch Claim Demo" to watch our AI agents automatically detect a flight cancellation, process the claim, and issue payment - all without manual intervention.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((message, index) => renderMessage(message, index))}
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

AgentWorkflow.displayName = "AgentWorkflow";

export default AgentWorkflow;
