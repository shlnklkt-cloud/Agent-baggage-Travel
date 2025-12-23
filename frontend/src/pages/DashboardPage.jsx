import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { LogOut, Send, Briefcase, FileText, AlertTriangle, Plane, Upload, CheckCircle, Clock, DollarSign, RefreshCw, Luggage, CalendarX, CalendarMinus, AlertCircle } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DashboardPage = ({ user, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [currentStep, setCurrentStep] = useState("welcome");
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [delayHours, setDelayHours] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [claimData, setClaimData] = useState(null);
  const [postponeDocuments, setPostponeDocuments] = useState([]);
  const [cancelDocuments, setCancelDocuments] = useState([]);
  const [shortenDocuments, setShortenDocuments] = useState([]);
  const [disruptionDocuments, setDisruptionDocuments] = useState([]);
  const [postponeDeathCert, setPostponeDeathCert] = useState(null);
  const [cancelDeathCert, setCancelDeathCert] = useState(null);
  const [shortenDeathCert, setShortenDeathCert] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const deathCertInputRef = useRef(null);
  const initializedRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Wake up backend immediately on component mount
    const wakeUpBackend = async () => {
      try {
        await axios.get(`${API}/`);
      } catch (error) {
        console.log("Backend wake-up call made");
      }
    };
    
    wakeUpBackend();
    
    if (!initializedRef.current && messages.length === 0) {
      initializedRef.current = true;
      initializeChat();
    }
  }, []);

  const initializeChat = async () => {
    setIsTyping(true);
    await delay(1000);

    addMessage({
      type: "agent",
      agent: "orchestrator",
      content: `Hi ${user.name}! I'm Jiffy Jane, your Claims Assistant. I can see your policy is active.`,
    });

    await delay(1500);

    addMessage({
      type: "policy-info",
      data: {
        policy_number: user.policy_number,
        policy_type: user.policy_type,
        status: user.policy_status,
      },
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "orchestrator",
      content: "I can help you with:",
    });

    setIsTyping(false);
    setCurrentStep("options");
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const addMessage = (message) => {
    setMessages((prev) => [...prev, { ...message, id: Date.now() + Math.random() }]);
  };

  const generateClaimNumber = () => {
    const random = Math.floor(Math.random() * 900000 + 100000).toString();
    return `CLM-TRV-2026-${random}`;
  };

  const handleOptionClick = async (option) => {
    if (option === "baggage") {
      addMessage({
        type: "user",
        content: "Baggage Delayed",
      });

      setCurrentStep("baggage-flow");
      setIsTyping(true);

      await delay(1000);

      addMessage({
        type: "system",
        content: "Baggage Claims Agent Activated",
      });

      try {
        const response = await axios.get(`${API}/itinerary/${user.passport_number}`);
        setItinerary(response.data);

        await delay(1500);

        addMessage({
          type: "agent",
          agent: "baggage",
          content: "Please select the flight from your travel itinerary for which your baggage was delayed, then click \"Proceed.\"",
        });

        await delay(500);

        addMessage({
          type: "itinerary",
          data: response.data,
        });

        setCurrentStep("select-flight");
      } catch (error) {
        addMessage({
          type: "agent",
          agent: "baggage",
          content: "I couldn't fetch your itinerary. Please try again later.",
        });
      }

      setIsTyping(false);
    } else if (option === "documents") {
      // Lost Travel Documents Flow
      addMessage({
        type: "user",
        content: "Lost Travel Documents",
      });

      setCurrentStep("documents-flow");
      setIsTyping(true);

      await delay(1000);

      addMessage({
        type: "system",
        content: "Document Claims Agent Activated",
      });

      await delay(1000);

      addMessage({
        type: "agent",
        agent: "documents",
        content: "I'm sorry to hear that your travel documents have been lost.",
      });

      await delay(1500);

      addMessage({
        type: "agent",
        agent: "documents",
        content: "Our records indicate that you are travelling on flight SQ882 from Singapore (SIN) to Haikou (HAK).",
      });

      await delay(1500);

      addMessage({
        type: "agent",
        agent: "documents",
        content: "Please select the type of document that was lost:",
      });

      setIsTyping(false);
      setCurrentStep("select-document-type");
    } else if (option === "medical") {
      // Medical Expenses Flow
      addMessage({
        type: "user",
        content: "Medical Expenses",
      });

      setCurrentStep("medical-flow");
      setIsTyping(true);

      await delay(1000);

      addMessage({
        type: "system",
        content: "Medical Claims Agent Activated",
      });

      await delay(1000);

      addMessage({
        type: "agent",
        agent: "medical",
        content: "I'm sorry to hear that you experienced a medical emergency during your travels.",
      });

      await delay(1500);

      addMessage({
        type: "agent",
        agent: "medical",
        content: "Our records indicate that you are travelling on flight SQ882 from Singapore (SIN) to Tokyo Narita (NRT).",
      });

      await delay(1500);

      addMessage({
        type: "agent",
        agent: "medical",
        content: "Please describe your medical emergency situation or select from the common types below:",
      });

      setIsTyping(false);
      setCurrentStep("select-medical-type");
    } else if (option === "baggage-loss") {
      // Baggage Loss/Damage Flow - same as Baggage Delayed
      addMessage({
        type: "user",
        content: "Baggage Loss/Damage",
      });

      setCurrentStep("baggage-loss-flow");
      setIsTyping(true);

      await delay(1000);

      addMessage({
        type: "system",
        content: "Baggage Loss/Damage Agent Activated",
      });

      await delay(1000);

      addMessage({
        type: "agent",
        agent: "baggage-loss",
        content: "I am sorry to hear that your baggage has been lost.",
      });

      try {
        const response = await axios.get(`${API}/itinerary/${user.passport_number}`);
        setItinerary(response.data);

        await delay(1500);

        addMessage({
          type: "agent",
          agent: "baggage-loss",
          content: "Please select the flight where your baggage was lost or damaged then click \"Proceed\"",
        });

        await delay(500);

        addMessage({
          type: "itinerary",
          data: response.data,
        });

        setCurrentStep("select-flight-baggage-loss");
      } catch (error) {
        addMessage({
          type: "agent",
          agent: "baggage-loss",
          content: "I couldn't fetch your itinerary. Please try again later.",
        });
      }

      setIsTyping(false);
    } else if (option === "postpone-trip") {
      // Postponing the Trip Flow
      addMessage({
        type: "user",
        content: "Postponing the Trip",
      });

      setCurrentStep("postpone-trip-flow");
      setIsTyping(true);

      await delay(1000);

      addMessage({
        type: "system",
        content: "Trip Postponement Agent Activated",
      });

      await delay(1000);

      addMessage({
        type: "agent",
        agent: "trip-change",
        content: "Our records indicate that you are travelling on flight SQ706 from Singapore (SIN) to Bangkok (BKK).",
      });

      await delay(1500);

      addMessage({
        type: "agent",
        agent: "trip-change",
        content: "What is the primary reason for postponing the trip?",
      });

      setIsTyping(false);
      setCurrentStep("select-postpone-reason");
    } else if (option === "cancel-trip") {
      // Cancelling the Trip Flow - same as Postponing
      addMessage({
        type: "user",
        content: "Cancelling the Trip",
      });

      setCurrentStep("cancel-trip-flow");
      setIsTyping(true);

      await delay(1000);

      addMessage({
        type: "system",
        content: "Trip Cancellation Agent Activated",
      });

      await delay(1000);

      addMessage({
        type: "agent",
        agent: "trip-change",
        content: "Our records indicate that you are travelling on flight SQ892 from Singapore (SIN) to Hong Kong (HKG).",
      });

      await delay(1500);

      addMessage({
        type: "agent",
        agent: "trip-change",
        content: "What is the primary reason for cancelling the trip?",
      });

      setIsTyping(false);
      setCurrentStep("select-cancel-reason");
    } else if (option === "shorten-trip") {
      // Shortening the Trip Flow - same as Postponing
      addMessage({
        type: "user",
        content: "Shortening the Trip",
      });

      setCurrentStep("shorten-trip-flow");
      setIsTyping(true);

      await delay(1000);

      addMessage({
        type: "system",
        content: "Trip Shortening Agent Activated",
      });

      await delay(1000);

      addMessage({
        type: "agent",
        agent: "trip-change",
        content: "Our records indicate that you are travelling on flight SQ894 from Singapore (SIN) to Tokyo Haneda (HND).",
      });

      await delay(1500);

      addMessage({
        type: "agent",
        agent: "trip-change",
        content: "What is the primary reason for shortening the trip?",
      });

      setIsTyping(false);
      setCurrentStep("select-shorten-reason");
    } else if (option === "trip-disruption") {
      // Trip Disruption Flow
      addMessage({
        type: "user",
        content: "Trip Disruption",
      });

      setCurrentStep("trip-disruption-flow");
      setIsTyping(true);

      await delay(1000);

      addMessage({
        type: "system",
        content: "Trip Disruption Agent Activated",
      });

      await delay(1000);

      addMessage({
        type: "agent",
        agent: "trip-disruption",
        content: "Our records indicate that you are travelling on flight SQ637 from Tokyo Narita (NRT) to Singapore (SIN).",
      });

      await delay(1500);

      addMessage({
        type: "agent",
        agent: "trip-disruption",
        content: "What is the primary reason for the trip disruption?",
      });

      setIsTyping(false);
      setCurrentStep("select-disruption-reason");
    }
  };

  const handleFlightClick = (flightNumber) => {
    setSelectedFlight(flightNumber);
    // Check if we're in baggage loss flow or regular baggage delayed flow
    if (currentStep === "select-flight-baggage-loss") {
      handleFlightSubmitBaggageLoss(flightNumber);
    } else {
      handleFlightSubmit(flightNumber);
    }
  };

  const handleFlightSubmit = async (flightNumber) => {
    const flight = flightNumber || inputValue;
    if (!flight) return;

    setSelectedFlight(flight);

    addMessage({
      type: "user",
      content: flight,
    });

    setInputValue("");
    setIsTyping(true);

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "baggage",
      content: `Thank you for selecting flight ${flight}. How long has your baggage been delayed? Please select from the options below:`,
    });

    setIsTyping(false);
    setCurrentStep("ask-delay-hours");
  };

  // Handler for Baggage Loss/Damage flight selection
  const handleFlightSubmitBaggageLoss = async (flightNumber) => {
    const flight = flightNumber;
    if (!flight) return;

    setSelectedFlight(flight);

    addMessage({
      type: "user",
      content: flight,
    });

    setIsTyping(true);

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "baggage-loss",
      content: `Thank you for selecting flight ${flight}. To process your claim, I'll need you to upload your Property Irregularity Report (PIR) document. This is the report you received from the airline when you reported the baggage issue.`,
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "baggage-loss",
      content: "Please upload your PIR document:",
    });

    setIsTyping(false);
    setDelayHours(0); // Set default for baggage loss
    setCurrentStep("upload-document-baggage-loss");
  };

  const handleDelayHoursSubmit = async (hours) => {
    const delayTime = hours || parseInt(inputValue);
    if (!delayTime || isNaN(delayTime)) return;

    setDelayHours(delayTime);

    addMessage({
      type: "user",
      content: `${delayTime} hours`,
    });

    setInputValue("");
    setIsTyping(true);

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "baggage",
      content: `I understand your baggage has been delayed for ${delayTime} hours. To process your claim, I'll need you to upload your Property Irregularity Report (PIR) document. This is the report you received from the airline when you reported the delayed baggage.`,
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "baggage",
      content: "Please upload your PIR document:",
    });

    setIsTyping(false);
    setCurrentStep("upload-document");
  };

  // Handler for new delay options (15 hours, 2 days, Lost/Missing)
  const handleDelayOptionSelect = async (option) => {
    const optionLabels = {
      "15-hours": "15 hours",
      "2-days": "2 days",
      "lost-missing": "Lost/Missing",
    };

    const optionHours = {
      "15-hours": 15,
      "2-days": 48,
      "lost-missing": 0,
    };

    const label = optionLabels[option];
    const hours = optionHours[option];

    setDelayHours(hours);

    addMessage({
      type: "user",
      content: label,
    });

    setIsTyping(true);

    await delay(1000);

    // Determine which agent based on current step
    const isBaggageLoss = currentStep === "ask-delay-hours-baggage-loss";
    const agent = isBaggageLoss ? "baggage-loss" : "baggage";

    if (option === "lost-missing") {
      addMessage({
        type: "agent",
        agent: agent,
        content: `I understand your baggage is lost or missing. To process your claim, I'll need you to upload your Property Irregularity Report (PIR) document. This is the report you received from the airline when you reported the lost baggage.`,
      });
    } else {
      addMessage({
        type: "agent",
        agent: agent,
        content: `I understand your baggage has been delayed for ${label}. To process your claim, I'll need you to upload your Property Irregularity Report (PIR) document. This is the report you received from the airline when you reported the delayed baggage.`,
      });
    }

    await delay(1000);

    addMessage({
      type: "agent",
      agent: agent,
      content: "Please upload your PIR document:",
    });

    setIsTyping(false);
    setCurrentStep(isBaggageLoss ? "upload-document-baggage-loss" : "upload-document");
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setCurrentStep("processing");  // Hide upload button

    addMessage({
      type: "user",
      content: `Uploaded: ${file.name}`,
    });

    setIsTyping(true);

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "baggage",
      content: `Thank you! I've received your PIR document (${file.name}). Now let me initiate the claims processing workflow.`,
    });

    await delay(1500);

    // Orchestrator calls Claim Processing Agent
    addMessage({
      type: "system",
      content: "Orchestrator Agent → Calling Claim Processing Agent",
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "claims",
      content: "I'm the Claim Processing Agent. I'll now perform the required validations for your baggage delay claim.",
    });

    // Generate claim number
    const claimNumber = generateClaimNumber();
    const compensationAmount = Math.floor(delayHours / 6) * 200;
    const incidentDate = new Date();
    incidentDate.setHours(incidentDate.getHours() - delayHours);

    setClaimData({
      claimNumber,
      compensationAmount,
      delayHours,
      incidentDate,
      flightNumber: selectedFlight,
    });

    await delay(1500);

    // Show claim initiation
    addMessage({
      type: "claim-initiated",
      data: {
        claimNumber,
        delayHours,
        flightNumber: selectedFlight,
      },
    });

    await delay(1000);

    // Perform 6 validations
    const validations = [
      { name: "Policy Validation", description: "Verifying policy status and coverage..." },
      { name: "Uploaded Document Validation", description: "Validating PIR document authenticity..." },
      { name: "Flight Information Verification", description: "Confirming flight details and delay status..." },
      { name: "Coverage Eligibility Check", description: "Checking baggage delay coverage eligibility..." },
      { name: "Delay Duration Verification", description: "Verifying reported delay duration..." },
      { name: "Claim Payment Amount Calculation", description: `Calculating claim payment: ${delayHours} hours ÷ 6 × $200 = $${compensationAmount}` },
    ];

    addMessage({
      type: "agent",
      agent: "claims",
      content: "Starting validation process...",
    });

    await delay(500);

    for (let i = 0; i < validations.length; i++) {
      addMessage({
        type: "validation-step",
        step: i + 1,
        total: 6,
        name: validations[i].name,
        description: validations[i].description,
        status: "processing",
      });

      await delay(1500);

      // Update the last message to show completed
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = { ...updated[lastIndex], status: "completed" };
        return updated;
      });

      await delay(500);
    }

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "claims",
      content: "All validations completed successfully! Your claim has been approved.",
    });

    await delay(1500);

    // Orchestrator calls Payment Processing Agent
    addMessage({
      type: "system",
      content: "Orchestrator Agent → Calling Payment Processing Agent",
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "payment",
      content: "I'm the Payment Processing Agent. I'll now process your claim payment.",
    });

    await delay(1500);

    // Show payment details
    addMessage({
      type: "payment-details",
      data: {
        claimNumber,
        compensationAmount,
        policyNumber: user.policy_number,
        currency: "$",
      },
    });

    await delay(1500);

    // Show claim summary
    addMessage({
      type: "claim-summary",
      data: {
        claimType: "Baggage Delay",
        claimIntimationDate: new Date().toLocaleDateString('en-SG', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        claimReferenceNumber: claimNumber,
        incidentDateTime: incidentDate.toLocaleDateString('en-SG', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        reason: `Baggage delayed for ${delayHours} hours on flight ${selectedFlight}`,
        policyNumber: user.policy_number,
        compensationAmount,
      },
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "orchestrator",
      content: "Your baggage delay claim has been successfully processed! The claim payment will be transferred to your registered bank account within 3-5 business days. Is there anything else I can help you with?",
    });

    setIsTyping(false);
    setCurrentStep("complete");
  };

  // File Upload Handler for Baggage Loss/Damage
  const handleFileUploadBaggageLoss = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setCurrentStep("processing-baggage-loss");

    addMessage({
      type: "user",
      content: `Uploaded: ${file.name}`,
    });

    setIsTyping(true);

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "baggage-loss",
      content: `Thank you! I've received your PIR document (${file.name}). Now let me initiate the claims processing workflow.`,
    });

    await delay(1500);

    addMessage({
      type: "system",
      content: "Orchestrator Agent → Calling Claim Processing Agent",
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "claims",
      content: "I'm the Claim Processing Agent. I'll now perform the required validations for your baggage loss/damage claim.",
    });

    const claimNumber = generateClaimNumber();
    // Compensation based on delay option selected
    const compensationAmount = delayHours === 0 ? 1000 : (delayHours >= 48 ? 600 : 400); // Lost = $1000, 2 days = $600, 15 hours = $400

    await delay(1500);

    addMessage({
      type: "claim-initiated",
      data: {
        claimNumber,
        delayHours: delayHours === 0 ? "Lost/Missing" : delayHours,
        flightNumber: selectedFlight,
      },
    });

    await delay(1000);

    const validations = [
      { name: "Policy Validation", description: "Verifying policy status and baggage coverage..." },
      { name: "Uploaded Document Validation", description: "Validating PIR document authenticity..." },
      { name: "Flight Information Verification", description: "Confirming flight details..." },
      { name: "Baggage Status Verification", description: "Verifying baggage loss/damage status..." },
      { name: "Coverage Eligibility Check", description: "Checking baggage loss/damage coverage eligibility..." },
      { name: "Claim Payment Amount Calculation", description: `Calculating claim payment: $${compensationAmount} (based on policy terms)` },
    ];

    addMessage({
      type: "agent",
      agent: "claims",
      content: "Starting validation process...",
    });

    await delay(500);

    for (let i = 0; i < validations.length; i++) {
      addMessage({
        type: "validation-step",
        step: i + 1,
        total: validations.length,
        name: validations[i].name,
        description: validations[i].description,
        status: "processing",
      });

      await delay(1500);

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = { ...updated[lastIndex], status: "completed" };
        return updated;
      });

      await delay(500);
    }

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "claims",
      content: "All validations completed successfully! Your claim has been approved.",
    });

    await delay(1500);

    addMessage({
      type: "system",
      content: "Orchestrator Agent → Calling Payment Processing Agent",
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "payment",
      content: "I'm the Payment Processing Agent. I'll now process your claim payment.",
    });

    await delay(1500);

    addMessage({
      type: "payment-details",
      data: {
        claimNumber,
        compensationAmount,
        policyNumber: user.policy_number,
        currency: "$",
      },
    });

    await delay(1500);

    addMessage({
      type: "claim-summary",
      data: {
        claimType: "Baggage Loss/Damage",
        claimIntimationDate: new Date().toLocaleDateString('en-SG', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        claimReferenceNumber: claimNumber,
        incidentDateTime: new Date().toLocaleDateString('en-SG', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        reason: delayHours === 0 ? `Baggage lost/missing on flight ${selectedFlight}` : `Baggage delayed for ${delayHours} hours on flight ${selectedFlight}`,
        policyNumber: user.policy_number,
        compensationAmount,
      },
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "orchestrator",
      content: "Your baggage loss/damage claim has been successfully processed! The claim payment will be transferred to your registered bank account within 3-5 business days. Is there anything else I can help you with?",
    });

    setIsTyping(false);
    setCurrentStep("complete");
  };

  // Postpone Reason Selection Handler
  const handlePostponeReasonSelect = async (reason) => {
    const reasonNames = {
      "death-serious-sickness": "Death/ Serious Sickness",
      "government-stop": "Government Authorities stopping travel",
      "riot-strike": "Riot/Strike/Civil Commotion",
      "natural-disaster": "Natural Disaster",
      "home-damage": "Serious Damage to home",
      "court-appearance": "Court Appearance",
      "child-guardian": "Child traveler – guardian cancels trip",
    };

    addMessage({
      type: "user",
      content: reasonNames[reason],
    });

    setIsTyping(true);

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "trip-change",
      content: `Thank you for selecting "${reasonNames[reason]}" as the reason for postponing your trip. To process your claim, please upload the following documents:`,
    });

    await delay(1000);

    addMessage({
      type: "postpone-documents-info",
    });

    await delay(500);

    addMessage({
      type: "agent",
      agent: "trip-change",
      content: "Please upload your documents:",
    });

    setIsTyping(false);
    setCurrentStep("upload-postpone-documents");
  };

  // Cancel Trip Reason Selection Handler
  const handleCancelReasonSelect = async (reason) => {
    const reasonNames = {
      "death-serious-sickness": "Death / Serious Sickness",
      "government-stop": "Government Authorities stopping travel",
      "riot-strike": "Riot/Strike/Civil Commotion",
      "natural-disaster": "Natural Disaster",
      "home-damage": "Serious Damage to home",
      "court-appearance": "Court Appearance",
      "child-guardian": "Child traveler – guardian cancels trip",
    };

    addMessage({
      type: "user",
      content: reasonNames[reason],
    });

    setIsTyping(true);

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "trip-change",
      content: `Thank you for selecting "${reasonNames[reason]}" as the reason for cancelling your trip. To process your claim, please upload the following documents:`,
    });

    await delay(1000);

    addMessage({
      type: "cancel-documents-info",
    });

    await delay(500);

    addMessage({
      type: "agent",
      agent: "trip-change",
      content: "Please upload your documents:",
    });

    setIsTyping(false);
    setCurrentStep("upload-cancel-documents");
  };

  // Shorten Trip Reason Selection Handler
  const handleShortenReasonSelect = async (reason) => {
    const reasonNames = {
      "death-serious-sickness": "Death / Serious Sickness",
      "government-stop": "Government Authorities stopping travel",
      "riot-strike": "Riot/Strike/Civil Commotion",
      "natural-disaster": "Natural Disaster",
      "home-damage": "Serious Damage to home",
      "court-appearance": "Court Appearance",
      "child-guardian": "Child traveler – guardian cancels trip",
    };

    addMessage({
      type: "user",
      content: reasonNames[reason],
    });

    setIsTyping(true);

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "trip-change",
      content: `Thank you for selecting "${reasonNames[reason]}" as the reason for shortening your trip. To process your claim, please upload the following documents:`,
    });

    await delay(1000);

    addMessage({
      type: "shorten-documents-info",
    });

    await delay(500);

    addMessage({
      type: "agent",
      agent: "trip-change",
      content: "Please upload your documents:",
    });

    setIsTyping(false);
    setCurrentStep("upload-shorten-documents");
  };

  // Trip Disruption Reason Selection Handler
  const handleDisruptionReasonSelect = async (reason) => {
    const reasonNames = {
      "serious-sickness": "Serious Sickness (You/Travel Companion)",
      "government-stop": "Government Authorities stopping travel",
      "riot-strike": "Riot/Strike/Civil Commotion",
      "natural-disaster": "Natural Disaster",
      "home-damage": "Serious Damage to home",
      "court-appearance": "Court Appearance",
      "child-guardian": "Child traveler – guardian cancels trip",
    };

    addMessage({
      type: "user",
      content: reasonNames[reason],
    });

    setIsTyping(true);

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "trip-disruption",
      content: `Thank you for selecting "${reasonNames[reason]}" as the reason for your trip disruption. To process your claim, please upload the following documents:`,
    });

    await delay(1000);

    addMessage({
      type: "disruption-documents-info",
    });

    await delay(500);

    addMessage({
      type: "agent",
      agent: "trip-disruption",
      content: "Please upload your documents:",
    });

    setIsTyping(false);
    setCurrentStep("upload-disruption-documents");
  };

  // Postpone Documents Upload Handler - requires 4 documents
  const handlePostponeDocumentsUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const newDocs = [...postponeDocuments, file.name];
    setPostponeDocuments(newDocs);

    addMessage({
      type: "user",
      content: `Uploaded: ${file.name}`,
    });

    setIsTyping(true);
    await delay(1000);

    // Check if we have all 4 required documents
    if (newDocs.length < 4) {
      addMessage({
        type: "agent",
        agent: "trip-change",
        content: `Document received (${newDocs.length}/4). Please upload ${4 - newDocs.length} more document${4 - newDocs.length > 1 ? 's' : ''} to proceed with your claim.`,
      });
      setIsTyping(false);
      // Stay on same step to allow more uploads
      return;
    }

    // All 4 documents uploaded, show options to proceed or upload Death Certificate
    addMessage({
      type: "agent",
      agent: "trip-change",
      content: `All 4 required documents received! You can now proceed with your claim or optionally upload a Death Certificate.`,
    });

    setIsTyping(false);
    setCurrentStep("postpone-ready-to-proceed");
  };

  // Process Postpone Claim
  const processPostponeClaim = async () => {
    setCurrentStep("processing-postpone");
    setIsTyping(true);

    await delay(1000);

    addMessage({
      type: "system",
      content: "Orchestrator Agent → Calling Claim Processing Agent",
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "claims",
      content: "I'm the Claim Processing Agent. I'll now perform the required validations for your trip postponement claim.",
    });

    const claimNumber = generateClaimNumber();
    const compensationAmount = 250;

    await delay(1500);

    addMessage({
      type: "claim-initiated",
      data: {
        claimNumber,
        delayHours: null,
        flightNumber: "Trip Postponement Claim",
      },
    });

    await delay(1000);

    const validations = [
      { name: "Policy Purchase Date Validation", description: "Verify Policy Purchase date. Purchase date is 10 days prior to travel date ✓" },
      { name: "Travel Date Validation", description: "Verifying that date of travel is within 30 days ✓" },
      { name: "Document Verification", description: "Validating all 4 submitted documents..." },
      { name: "Reason Verification", description: "Confirming eligibility based on reason provided..." },
      { name: "Expense Verification", description: "Verifying additional expenses claimed..." },
      { name: "Claim Payment Amount Calculation", description: `Calculating claim payment: $${compensationAmount} (based on policy terms)` },
    ];

    addMessage({
      type: "agent",
      agent: "claims",
      content: "Starting validation process...",
    });

    await delay(500);

    for (let i = 0; i < validations.length; i++) {
      addMessage({
        type: "validation-step",
        step: i + 1,
        total: validations.length,
        name: validations[i].name,
        description: validations[i].description,
        status: "processing",
      });

      await delay(1500);

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = { ...updated[lastIndex], status: "completed" };
        return updated;
      });

      await delay(500);
    }

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "claims",
      content: "All validations completed successfully! Your claim has been approved.",
    });

    await delay(1500);

    addMessage({
      type: "system",
      content: "Orchestrator Agent → Calling Payment Processing Agent",
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "payment",
      content: "I'm the Payment Processing Agent. I'll now process your claim payment.",
    });

    await delay(1500);

    addMessage({
      type: "payment-details",
      data: {
        claimNumber,
        compensationAmount,
        policyNumber: user.policy_number,
        currency: "$",
      },
    });

    await delay(1500);

    addMessage({
      type: "claim-summary",
      data: {
        claimType: "Trip Postponement",
        claimIntimationDate: new Date().toLocaleDateString('en-SG', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        claimReferenceNumber: claimNumber,
        incidentDateTime: new Date().toLocaleDateString('en-SG', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        reason: "Trip postponement due to unforeseen circumstances",
        policyNumber: user.policy_number,
        compensationAmount,
      },
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "orchestrator",
      content: "Your trip postponement claim has been successfully processed! The claim payment will be transferred to your registered bank account within 3-5 business days. Is there anything else I can help you with?",
    });

    setIsTyping(false);
    setCurrentStep("complete");
  };

  // Cancel Documents Upload Handler - requires 4 documents
  const handleCancelDocumentsUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const newDocs = [...cancelDocuments, file.name];
    setCancelDocuments(newDocs);

    addMessage({
      type: "user",
      content: `Uploaded: ${file.name}`,
    });

    setIsTyping(true);
    await delay(1000);

    if (newDocs.length < 4) {
      addMessage({
        type: "agent",
        agent: "trip-change",
        content: `Document received (${newDocs.length}/4). Please upload ${4 - newDocs.length} more document${4 - newDocs.length > 1 ? 's' : ''} to proceed with your claim.`,
      });
      setIsTyping(false);
      return;
    }

    // All 4 documents uploaded, show options to proceed or upload Death Certificate
    addMessage({
      type: "agent",
      agent: "trip-change",
      content: `All 4 required documents received! You can now proceed with your claim or optionally upload a Death Certificate.`,
    });

    setIsTyping(false);
    setCurrentStep("cancel-ready-to-proceed");
  };

  // Process Cancel Claim
  const processCancelClaim = async () => {
    setCurrentStep("processing-cancel");
    setIsTyping(true);

    await delay(1000);

    addMessage({
      type: "system",
      content: "Orchestrator Agent → Calling Claim Processing Agent",
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "claims",
      content: "I'm the Claim Processing Agent. I'll now perform the required validations for your trip cancellation claim.",
    });

    const claimNumber = generateClaimNumber();
    const compensationAmount = 1000;

    await delay(1500);

    addMessage({
      type: "claim-initiated",
      data: {
        claimNumber,
        delayHours: null,
        flightNumber: "Trip Cancellation Claim",
      },
    });

    await delay(1000);

    const validations = [
      { name: "Policy Purchase Date Validation", description: "Verify Policy Purchase date. Purchase date is 10 days prior to travel date ✓" },
      { name: "Travel Date Validation", description: "Verifying that date of travel is within 30 days ✓" },
      { name: "Document Verification", description: "Validating all 4 submitted documents..." },
      { name: "Reason Verification", description: "Confirming eligibility based on reason provided..." },
      { name: "Expense Verification", description: "Verifying non-refundable expenses claimed..." },
      { name: "Claim Payment Amount Calculation", description: `Calculating claim payment: $${compensationAmount} (based on policy terms)` },
    ];

    addMessage({
      type: "agent",
      agent: "claims",
      content: "Starting validation process...",
    });

    await delay(500);

    for (let i = 0; i < validations.length; i++) {
      addMessage({
        type: "validation-step",
        step: i + 1,
        total: validations.length,
        name: validations[i].name,
        description: validations[i].description,
        status: "processing",
      });

      await delay(1500);

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = { ...updated[lastIndex], status: "completed" };
        return updated;
      });

      await delay(500);
    }

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "claims",
      content: "All validations completed successfully! Your claim has been approved.",
    });

    await delay(1500);

    addMessage({
      type: "system",
      content: "Orchestrator Agent → Calling Payment Processing Agent",
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "payment",
      content: "I'm the Payment Processing Agent. I'll now process your claim payment.",
    });

    await delay(1500);

    addMessage({
      type: "payment-details",
      data: {
        claimNumber,
        compensationAmount,
        policyNumber: user.policy_number,
        currency: "$",
      },
    });

    await delay(1500);

    addMessage({
      type: "claim-summary",
      data: {
        claimType: "Trip Cancellation",
        claimIntimationDate: new Date().toLocaleDateString('en-SG', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        claimReferenceNumber: claimNumber,
        incidentDateTime: new Date().toLocaleDateString('en-SG', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        reason: "Trip cancellation due to unforeseen circumstances",
        policyNumber: user.policy_number,
        compensationAmount,
      },
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "orchestrator",
      content: "Your trip cancellation claim has been successfully processed! The claim payment will be transferred to your registered bank account within 3-5 business days. Is there anything else I can help you with?",
    });

    setIsTyping(false);
    setCurrentStep("complete");
  };

  // Shorten Documents Upload Handler - requires 4 documents
  const handleShortenDocumentsUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const newDocs = [...shortenDocuments, file.name];
    setShortenDocuments(newDocs);

    addMessage({
      type: "user",
      content: `Uploaded: ${file.name}`,
    });

    setIsTyping(true);
    await delay(1000);

    if (newDocs.length < 4) {
      addMessage({
        type: "agent",
        agent: "trip-change",
        content: `Document received (${newDocs.length}/4). Please upload ${4 - newDocs.length} more document${4 - newDocs.length > 1 ? 's' : ''} to proceed with your claim.`,
      });
      setIsTyping(false);
      return;
    }

    // All 4 documents uploaded, show options to proceed or upload Death Certificate
    addMessage({
      type: "agent",
      agent: "trip-change",
      content: `All 4 required documents received! You can now proceed with your claim or optionally upload a Death Certificate.`,
    });

    setIsTyping(false);
    setCurrentStep("shorten-ready-to-proceed");
  };

  // Process Shorten Claim
  const processShortenClaim = async () => {
    setCurrentStep("processing-shorten");
    setIsTyping(true);

    await delay(1000);

    addMessage({
      type: "system",
      content: "Orchestrator Agent → Calling Claim Processing Agent",
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "claims",
      content: "I'm the Claim Processing Agent. I'll now perform the required validations for your trip shortening claim.",
    });

    const claimNumber = generateClaimNumber();
    const compensationAmount = 600;

    await delay(1500);

    addMessage({
      type: "claim-initiated",
      data: {
        claimNumber,
        delayHours: null,
        flightNumber: "Trip Shortening Claim",
      },
    });

    await delay(1000);

    const validations = [
      { name: "Policy Purchase Date Validation", description: "Verify Policy Purchase date. Purchase date is 10 days prior to travel date ✓" },
      { name: "Travel Date Validation", description: "Verifying that date of travel is within 30 days ✓" },
      { name: "Document Verification", description: "Validating all 4 submitted documents..." },
      { name: "Reason Verification", description: "Confirming eligibility based on reason provided..." },
      { name: "Expense Verification", description: "Verifying unused travel expenses claimed..." },
      { name: "Claim Payment Amount Calculation", description: `Calculating claim payment: $${compensationAmount} (based on policy terms)` },
    ];

    addMessage({
      type: "agent",
      agent: "claims",
      content: "Starting validation process...",
    });

    await delay(500);

    for (let i = 0; i < validations.length; i++) {
      addMessage({
        type: "validation-step",
        step: i + 1,
        total: validations.length,
        name: validations[i].name,
        description: validations[i].description,
        status: "processing",
      });

      await delay(1500);

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = { ...updated[lastIndex], status: "completed" };
        return updated;
      });

      await delay(500);
    }

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "claims",
      content: "All validations completed successfully! Your claim has been approved.",
    });

    await delay(1500);

    addMessage({
      type: "system",
      content: "Orchestrator Agent → Calling Payment Processing Agent",
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "payment",
      content: "I'm the Payment Processing Agent. I'll now process your claim payment.",
    });

    await delay(1500);

    addMessage({
      type: "payment-details",
      data: {
        claimNumber,
        compensationAmount,
        policyNumber: user.policy_number,
        currency: "$",
      },
    });

    await delay(1500);

    addMessage({
      type: "claim-summary",
      data: {
        claimType: "Trip Shortening",
        claimIntimationDate: new Date().toLocaleDateString('en-SG', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        claimReferenceNumber: claimNumber,
        incidentDateTime: new Date().toLocaleDateString('en-SG', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        reason: "Trip shortening due to unforeseen circumstances",
        policyNumber: user.policy_number,
        compensationAmount,
      },
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "orchestrator",
      content: "Your trip shortening claim has been successfully processed! The claim payment will be transferred to your registered bank account within 3-5 business days. Is there anything else I can help you with?",
    });

    setIsTyping(false);
    setCurrentStep("complete");
  };

  // Trip Disruption Documents Upload Handler - requires 4 documents
  const handleDisruptionDocumentsUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const newDocs = [...disruptionDocuments, file.name];
    setDisruptionDocuments(newDocs);

    addMessage({
      type: "user",
      content: `Uploaded: ${file.name}`,
    });

    setIsTyping(true);
    await delay(1000);

    if (newDocs.length < 4) {
      addMessage({
        type: "agent",
        agent: "trip-disruption",
        content: `Document received (${newDocs.length}/4). Please upload ${4 - newDocs.length} more document${4 - newDocs.length > 1 ? 's' : ''} to proceed with your claim.`,
      });
      setIsTyping(false);
      return;
    }

    setCurrentStep("processing-disruption");

    addMessage({
      type: "agent",
      agent: "trip-disruption",
      content: `All 4 required documents received. Now let me initiate the claims processing workflow.`,
    });

    await delay(1500);

    addMessage({
      type: "system",
      content: "Orchestrator Agent → Calling Claim Processing Agent",
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "claims",
      content: "I'm the Claim Processing Agent. I'll now perform the required validations for your trip disruption claim.",
    });

    const claimNumber = generateClaimNumber();
    const compensationAmount = 1500;

    await delay(1500);

    addMessage({
      type: "claim-initiated",
      data: {
        claimNumber,
        delayHours: null,
        flightNumber: "Trip Disruption Claim",
      },
    });

    await delay(1000);

    const validations = [
      { name: "Policy Purchase Date Validation", description: "Verifying Policy Purchase date. ✓" },
      { name: "Enhanced PreX Plan Verification", description: "Verifying Enhanced PreX Plan ✓" },
      { name: "Prestige Plan Verification", description: "Prestige Plan Verified ✓" },
      { name: "Preexisting Medical Condition Check", description: "Copayment for preexisting medical condition: 50% ✓" },
      { name: "Document Verification", description: "Validating all 4 submitted documents..." },
      { name: "Claim Payment Amount Calculation", description: `Calculating claim payment: $${compensationAmount} (based on policy terms)` },
    ];

    addMessage({
      type: "agent",
      agent: "claims",
      content: "Starting validation process...",
    });

    await delay(500);

    for (let i = 0; i < validations.length; i++) {
      addMessage({
        type: "validation-step",
        step: i + 1,
        total: validations.length,
        name: validations[i].name,
        description: validations[i].description,
        status: "processing",
      });

      await delay(1500);

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = { ...updated[lastIndex], status: "completed" };
        return updated;
      });

      await delay(500);
    }

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "claims",
      content: "All validations completed successfully! Your claim has been approved.",
    });

    await delay(1500);

    addMessage({
      type: "system",
      content: "Orchestrator Agent → Calling Payment Processing Agent",
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "payment",
      content: "I'm the Payment Processing Agent. I'll now process your claim payment.",
    });

    await delay(1500);

    addMessage({
      type: "payment-details",
      data: {
        claimNumber,
        compensationAmount,
        policyNumber: user.policy_number,
        currency: "$",
      },
    });

    await delay(1500);

    addMessage({
      type: "claim-summary",
      data: {
        claimType: "Trip Disruption",
        claimIntimationDate: new Date().toLocaleDateString('en-SG', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        claimReferenceNumber: claimNumber,
        incidentDateTime: new Date().toLocaleDateString('en-SG', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        reason: "Trip disruption due to Death/Serious Sickness",
        policyNumber: user.policy_number,
        compensationAmount,
      },
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "orchestrator",
      content: "Your trip disruption claim has been successfully processed! The claim payment will be transferred to your registered bank account within 3-5 business days. Is there anything else I can help you with?",
    });

    setIsTyping(false);
    setCurrentStep("complete");
  };

  // Document Type Selection Handler
  const handleDocumentTypeSelect = async (documentType) => {
    const documentNames = {
      passport: "Passport",
      visa: "Visa",
      other: "Other Document",
    };

    addMessage({
      type: "user",
      content: documentNames[documentType],
    });

    setIsTyping(true);

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "documents",
      content: `I understand you've lost your ${documentNames[documentType]}. To process your claim, I'll need you to upload a police report or loss report documenting the incident.`,
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "documents",
      content: "Please upload your police report or loss report:",
    });

    setIsTyping(false);
    setCurrentStep("upload-document-proof");
  };

  // Document Proof Upload Handler (Police Report)
  const handleDocumentProofUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);

    addMessage({
      type: "user",
      content: `Uploaded: ${file.name}`,
    });

    setIsTyping(true);

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "documents",
      content: `Thank you! I've received your police/loss report (${file.name}). Next, I'll need proof of your travel.`,
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "documents",
      content: "Please upload your proof of travel (e.g., flight tickets, boarding passes, hotel bookings):",
    });

    setIsTyping(false);
    setCurrentStep("upload-proof-of-travel");
  };

  // Proof of Travel Upload Handler
  const handleProofOfTravelUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    addMessage({
      type: "user",
      content: `Uploaded: ${file.name}`,
    });

    setIsTyping(true);

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "documents",
      content: `Great! I've received your proof of travel (${file.name}). Finally, I'll need a Lost Item Declaration.`,
    });

    await delay(1000);

    addMessage({
      type: "lost-item-declaration-info",
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "documents",
      content: "Please upload your Lost Item Declaration:",
    });

    setIsTyping(false);
    setCurrentStep("upload-lost-item-declaration");
  };

  // Lost Item Declaration Upload Handler
  const handleLostItemDeclarationUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setCurrentStep("processing-documents");

    addMessage({
      type: "user",
      content: `Uploaded: ${file.name}`,
    });

    setIsTyping(true);

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "documents",
      content: `Thank you! I've received all required documents. Now let me initiate the claims processing workflow.`,
    });

    await delay(1500);

    addMessage({
      type: "system",
      content: "Orchestrator Agent → Calling Claim Processing Agent",
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "claims",
      content: "I'm the Claim Processing Agent. I'll now perform the required validations for your lost document claim.",
    });

    const claimNumber = generateClaimNumber();
    const compensationAmount = 500; // Fixed compensation for lost documents

    await delay(1500);

    addMessage({
      type: "claim-initiated",
      data: {
        claimNumber,
        delayHours: null,
        flightNumber: "Lost Document Claim",
      },
    });

    await delay(1000);

    const validations = [
      { name: "Policy Validation", description: "Verifying policy status and document coverage..." },
      { name: "Document Verification", description: "Validating police report authenticity..." },
      { name: "Coverage Eligibility Check", description: "Checking lost document coverage eligibility..." },
      { name: "Claim Payment Amount Calculation", description: `Calculating claim payment: $${compensationAmount} (fixed coverage)` },
    ];

    addMessage({
      type: "agent",
      agent: "claims",
      content: "Starting validation process...",
    });

    await delay(500);

    for (let i = 0; i < validations.length; i++) {
      addMessage({
        type: "validation-step",
        step: i + 1,
        total: validations.length,
        name: validations[i].name,
        description: validations[i].description,
        status: "processing",
      });

      await delay(1500);

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = { ...updated[lastIndex], status: "completed" };
        return updated;
      });

      await delay(500);
    }

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "claims",
      content: "All validations completed successfully! Your claim has been approved.",
    });

    await delay(1500);

    addMessage({
      type: "system",
      content: "Orchestrator Agent → Calling Payment Processing Agent",
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "payment",
      content: "I'm the Payment Processing Agent. I'll now process your claim payment.",
    });

    await delay(1500);

    addMessage({
      type: "payment-details",
      data: {
        claimNumber,
        compensationAmount,
        policyNumber: user.policy_number,
        currency: "$",
      },
    });

    await delay(1500);

    addMessage({
      type: "claim-summary",
      data: {
        claimType: "Lost Travel Documents",
        claimIntimationDate: new Date().toLocaleDateString('en-SG', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        claimReferenceNumber: claimNumber,
        incidentDateTime: new Date().toLocaleDateString('en-SG', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        reason: "Lost travel documents during trip",
        policyNumber: user.policy_number,
        compensationAmount,
      },
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "orchestrator",
      content: "Your lost document claim has been successfully processed! The claim payment will be transferred to your registered bank account within 3-5 business days. Is there anything else I can help you with?",
    });

    setIsTyping(false);
    setCurrentStep("complete");
  };

  // Medical Type Selection Handler
  const handleMedicalTypeSelect = async (medicalType) => {
    const medicalNames = {
      hospitalization: "Hospitalization",
      outpatient: "Outpatient Treatment",
      emergency: "Emergency Treatment",
      medication: "Medication Purchase",
    };

    addMessage({
      type: "user",
      content: medicalNames[medicalType],
    });

    setIsTyping(true);

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "medical",
      content: `I understand you need to file a claim for ${medicalNames[medicalType]}. To process your claim, I'll need you to upload your medical bills and/or hospital reports.`,
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "medical",
      content: "Please upload your medical bills or reports:",
    });

    setIsTyping(false);
    setCurrentStep("upload-medical-document");
  };

  // Medical Document Upload Handler
  const handleMedicalDocumentUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setCurrentStep("processing-medical");

    addMessage({
      type: "user",
      content: `Uploaded: ${file.name}`,
    });

    setIsTyping(true);

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "medical",
      content: `Thank you! I've received your medical document (${file.name}). Now let me initiate the claims processing workflow.`,
    });

    await delay(1500);

    addMessage({
      type: "system",
      content: "Orchestrator Agent → Calling Claim Processing Agent",
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "claims",
      content: "I'm the Claim Processing Agent. I'll now perform the required validations for your medical claim.",
    });

    const claimNumber = generateClaimNumber();
    const compensationAmount = 2500; // Example medical compensation

    await delay(1500);

    addMessage({
      type: "claim-initiated",
      data: {
        claimNumber,
        delayHours: null,
        flightNumber: "Medical Emergency Claim",
      },
    });

    await delay(1000);

    const validations = [
      { name: "Policy Validation", description: "Verifying policy status and medical coverage..." },
      { name: "Medical Document Verification", description: "Validating medical bills and reports..." },
      { name: "Treatment Verification", description: "Confirming treatment details..." },
      { name: "Coverage Eligibility Check", description: "Checking medical emergency coverage eligibility..." },
      { name: "Claim Payment Amount Calculation", description: `Calculating claim payment: $${compensationAmount} (based on submitted bills)` },
    ];

    addMessage({
      type: "agent",
      agent: "claims",
      content: "Starting validation process...",
    });

    await delay(500);

    for (let i = 0; i < validations.length; i++) {
      addMessage({
        type: "validation-step",
        step: i + 1,
        total: validations.length,
        name: validations[i].name,
        description: validations[i].description,
        status: "processing",
      });

      await delay(1500);

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = { ...updated[lastIndex], status: "completed" };
        return updated;
      });

      await delay(500);
    }

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "claims",
      content: "All validations completed successfully! Your medical claim has been approved.",
    });

    await delay(1500);

    addMessage({
      type: "system",
      content: "Orchestrator Agent → Calling Payment Processing Agent",
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "payment",
      content: "I'm the Payment Processing Agent. I'll now process your medical claim payment.",
    });

    await delay(1500);

    addMessage({
      type: "payment-details",
      data: {
        claimNumber,
        compensationAmount,
        policyNumber: user.policy_number,
        currency: "$",
      },
    });

    await delay(1500);

    addMessage({
      type: "claim-summary",
      data: {
        claimType: "Medical Emergency",
        claimIntimationDate: new Date().toLocaleDateString('en-SG', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        claimReferenceNumber: claimNumber,
        incidentDateTime: new Date().toLocaleDateString('en-SG', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        reason: "Medical emergency during travel",
        policyNumber: user.policy_number,
        compensationAmount,
      },
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "orchestrator",
      content: "Your medical emergency claim has been successfully processed! The claim payment will be transferred to your registered bank account within 3-5 business days. Is there anything else I can help you with?",
    });

    setIsTyping(false);
    setCurrentStep("complete");
  };

  // Handle Initiate New Claim - clears messages and restarts conversation
  const handleInitiateNewClaim = async () => {
    // Reset all state
    setMessages([]);
    setCurrentStep("init");
    setSelectedFlight(null);
    setItinerary(null);
    setUploadedFile(null);
    setInputValue("");
    setIsTyping(false);
    setPostponeDocuments([]);
    setCancelDocuments([]);
    setShortenDocuments([]);
    setDisruptionDocuments([]);
    
    // Restart the chat
    await delay(100);
    setIsTyping(true);
    await delay(1000);

    addMessage({
      type: "agent",
      agent: "orchestrator",
      content: `Hi ${user.name}! I'm Jiffy Jane, your Claims Assistant. I can see your policy is active.`,
    });

    await delay(1500);

    addMessage({
      type: "policy-info",
      data: {
        policy_number: user.policy_number,
        policy_type: user.policy_type,
        status: user.policy_status,
      },
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "orchestrator",
      content: "I can help you with:",
    });

    setIsTyping(false);
    setCurrentStep("options");
  };

  // Generic Document Upload Handler for new claim types
  const handleGenericDocUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Determine claim type based on current step
    const claimTypes = {
      "upload-baggage-loss-docs": { type: "Baggage Loss/Damage", agent: "baggage-loss", amount: 800 },
      "upload-postpone-docs": { type: "Trip Postponement", agent: "trip-change", amount: 600 },
      "upload-cancel-docs": { type: "Trip Cancellation", agent: "trip-change", amount: 1200 },
      "upload-shorten-docs": { type: "Trip Shortening", agent: "trip-change", amount: 500 },
      "upload-disruption-docs": { type: "Trip Disruption", agent: "trip-disruption", amount: 400 },
    };

    const claimInfo = claimTypes[currentStep] || { type: "General Claim", agent: "claims", amount: 500 };

    addMessage({
      type: "user",
      content: `Uploaded: ${file.name}`,
    });

    setIsTyping(true);
    setCurrentStep("processing-generic");

    await delay(1000);

    addMessage({
      type: "agent",
      agent: claimInfo.agent,
      content: `Thank you! I've received your document (${file.name}). Now let me initiate the claims processing workflow.`,
    });

    await delay(1500);

    addMessage({
      type: "system",
      content: "Orchestrator Agent → Calling Claim Processing Agent",
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "claims",
      content: `I'm the Claim Processing Agent. I'll now perform the required validations for your ${claimInfo.type} claim.`,
    });

    const claimNumber = generateClaimNumber();
    const compensationAmount = claimInfo.amount;

    await delay(1500);

    addMessage({
      type: "claim-initiated",
      data: {
        claimNumber,
        delayHours: null,
        flightNumber: `${claimInfo.type} Claim`,
      },
    });

    await delay(1000);

    const validations = [
      { name: "Policy Validation", description: `Verifying policy status and ${claimInfo.type.toLowerCase()} coverage...` },
      { name: "Document Verification", description: "Validating submitted documents..." },
      { name: "Coverage Eligibility Check", description: `Checking ${claimInfo.type.toLowerCase()} coverage eligibility...` },
      { name: "Claim Payment Amount Calculation", description: `Calculating claim payment: $${compensationAmount} (based on policy terms)` },
    ];

    addMessage({
      type: "agent",
      agent: "claims",
      content: "Starting validation process...",
    });

    await delay(500);

    for (let i = 0; i < validations.length; i++) {
      addMessage({
        type: "validation-step",
        step: i + 1,
        total: validations.length,
        name: validations[i].name,
        description: validations[i].description,
        status: "processing",
      });

      await delay(1500);

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = { ...updated[lastIndex], status: "completed" };
        return updated;
      });

      await delay(500);
    }

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "claims",
      content: "All validations completed successfully! Your claim has been approved.",
    });

    await delay(1500);

    addMessage({
      type: "system",
      content: "Orchestrator Agent → Calling Payment Processing Agent",
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "payment",
      content: "I'm the Payment Processing Agent. I'll now process your claim payment.",
    });

    await delay(1500);

    addMessage({
      type: "payment-details",
      data: {
        claimNumber,
        compensationAmount,
        policyNumber: user.policy_number,
        currency: "$",
      },
    });

    await delay(1500);

    addMessage({
      type: "claim-summary",
      data: {
        claimType: claimInfo.type,
        claimIntimationDate: new Date().toLocaleDateString('en-SG', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        claimReferenceNumber: claimNumber,
        incidentDateTime: new Date().toLocaleDateString('en-SG', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        reason: `${claimInfo.type} during travel`,
        policyNumber: user.policy_number,
        compensationAmount,
      },
    });

    await delay(1000);

    addMessage({
      type: "agent",
      agent: "orchestrator",
      content: `Your ${claimInfo.type.toLowerCase()} claim has been successfully processed! The claim payment will be transferred to your registered bank account within 3-5 business days. Is there anything else I can help you with?`,
    });

    setIsTyping(false);
    setCurrentStep("complete");
  };

  const handleSendMessage = () => {
    if (currentStep === "select-flight" && inputValue) {
      handleFlightSubmit();
    } else if (currentStep === "ask-delay-hours" && inputValue) {
      handleDelayHoursSubmit();
    }
  };

  const renderMessage = (message) => {
    switch (message.type) {
      case "agent":
        const agentColors = {
          orchestrator: { bg: "bg-orange-100", dot: "bg-orange-400", text: "text-orange-600", name: "Jiffy Jane", useImage: true },
          baggage: { bg: "bg-purple-100", dot: "bg-purple-400", text: "text-purple-600", name: "Baggage Claims Agent", useImage: false },
          "baggage-loss": { bg: "bg-amber-100", dot: "bg-amber-400", text: "text-amber-600", name: "Baggage Loss/Damage Agent", useImage: false },
          documents: { bg: "bg-blue-100", dot: "bg-blue-400", text: "text-blue-600", name: "Document Claims Agent", useImage: false },
          medical: { bg: "bg-red-100", dot: "bg-red-400", text: "text-red-600", name: "Medical Claims Agent", useImage: false },
          "trip-change": { bg: "bg-teal-100", dot: "bg-teal-400", text: "text-teal-600", name: "Trip Change Agent", useImage: false },
          "trip-disruption": { bg: "bg-rose-100", dot: "bg-rose-400", text: "text-rose-600", name: "Trip Disruption Agent", useImage: false },
          claims: { bg: "bg-indigo-100", dot: "bg-indigo-400", text: "text-indigo-600", name: "Claim Processing Agent", useImage: false },
          payment: { bg: "bg-green-100", dot: "bg-green-400", text: "text-green-600", name: "Payment Processing Agent", useImage: false },
        };
        const colors = agentColors[message.agent] || agentColors.orchestrator;
        
        return (
          <div key={message.id} className="flex items-start gap-3 mb-4">
            {colors.useImage ? (
              <img 
                src="https://customer-assets.emergentagent.com/job_travel-claims-flow/artifacts/vsbkds6u_image.png"
                alt="Jiffy Jane"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.bg}`}>
                <div className={`w-6 h-6 rounded-full ${colors.dot}`} />
              </div>
            )}
            <div>
              <p className={`text-sm font-semibold mb-1 ${colors.text}`}>
                {colors.name}
              </p>
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <p className="text-gray-700">{message.content}</p>
              </div>
            </div>
          </div>
        );

      case "user":
        return (
          <div key={message.id} className="flex justify-end mb-4">
            <div className="flex items-start gap-3">
              <div className="bg-orange-500 text-white rounded-lg px-4 py-2">
                <p>{message.content}</p>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        );

      case "system":
        return (
          <div key={message.id} className="flex justify-center mb-4">
            <div className="bg-gray-100 rounded-full px-4 py-2">
              <p className="text-sm text-gray-600 font-medium">{message.content}</p>
            </div>
          </div>
        );

      case "policy-info":
        return (
          <div key={message.id} className="ml-13 mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Your Policy</span>
              </div>
              <p className="text-sm text-gray-700">
                Policy Number: <strong>{message.data.policy_number}</strong>
              </p>
              <p className="text-sm text-gray-700">
                Type: {message.data.policy_type}
              </p>
              <p className="text-sm text-gray-700">
                Status: <span className="text-green-600 font-semibold">{message.data.status}</span>
              </p>
            </div>
          </div>
        );

      case "itinerary":
        return (
          <div key={message.id} className="ml-13 mb-4">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-w-2xl shadow-sm">
              <div className="bg-gray-800 text-white px-4 py-2 flex items-center gap-2">
                <Plane className="w-4 h-4" />
                <span className="font-semibold">Travel Itinerary</span>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">Select</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Flight</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Route</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Airline</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Journey</th>
                  </tr>
                </thead>
                <tbody>
                  {message.data.segments.map((segment, index) => (
                    <tr key={index} className={`border-t border-gray-100 ${selectedFlight === segment.flight_number ? 'bg-orange-50' : ''}`}>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="radio"
                          name="flight-selection"
                          value={segment.flight_number}
                          checked={selectedFlight === segment.flight_number}
                          onChange={() => setSelectedFlight(segment.flight_number)}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500 cursor-pointer"
                          data-testid={`flight-radio-${segment.flight_number}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-800 font-semibold">
                          {segment.flight_number}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{segment.route}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{segment.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{segment.airline}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          segment.journey_type === "Outward"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {segment.journey_type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "claim-initiated":
        const isBaggageDelayed = message.data.delayHours !== null && message.data.delayHours !== undefined && typeof message.data.delayHours === 'number';
        return (
          <div key={message.id} className="ml-13 mb-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Claim Initiated</span>
              </div>
              <p className="text-sm text-gray-700">
                Claim Reference: <strong>{message.data.claimNumber}</strong>
              </p>
              {isBaggageDelayed && (
                <>
                  <p className="text-sm text-gray-700">
                    Flight: <strong>{message.data.flightNumber}</strong>
                  </p>
                  <p className="text-sm text-gray-700">
                    Reported Delay: <strong>{message.data.delayHours} hours</strong>
                  </p>
                </>
              )}
            </div>
          </div>
        );

      case "validation-step":
        return (
          <div key={message.id} className="ml-13 mb-2">
            <div className={`flex items-center gap-3 p-3 rounded-lg border ${
              message.status === "completed" 
                ? "bg-green-50 border-green-200" 
                : "bg-blue-50 border-blue-200"
            }`}>
              {message.status === "completed" ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <div className="animate-spin w-5 h-5 border-2 border-blue-300 border-t-blue-600 rounded-full" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-semibold ${
                  message.status === "completed" ? "text-green-700" : "text-blue-700"
                }`}>
                  {message.name}
                </p>
                <p className="text-xs text-gray-600">{message.description}</p>
              </div>
              {message.status === "completed" && (
                <span className="text-xs text-green-600 font-medium">✓ Passed</span>
              )}
            </div>
          </div>
        );

      case "payment-details":
        return (
          <div key={message.id} className="ml-13 mb-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Claim Payment Details</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  Claim Number: <strong>{message.data.claimNumber}</strong>
                </p>
                <p className="text-sm text-gray-700">
                  Policy Number: <strong>{message.data.policyNumber}</strong>
                </p>
                <p className="text-sm text-gray-700">
                  Claim Payment Amount: <strong className="text-green-600 text-lg">
                    {message.data.currency} {message.data.compensationAmount.toFixed(2)}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        );

      case "claim-summary":
        return (
          <div key={message.id} className="ml-13 mb-4">
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden max-w-lg shadow-md">
              <div style={{ backgroundColor: '#FF7E00' }} className="text-white px-4 py-3">
                <h3 className="font-bold text-lg">Claim Summary</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Policy Number:</span>
                  <span className="font-semibold text-gray-800">{message.data.policyNumber}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Claim Reference Number:</span>
                  <span className="font-semibold text-orange-600">{message.data.claimReferenceNumber}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Incident Date & Time:</span>
                  <span className="font-semibold text-gray-800">{message.data.incidentDateTime}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Reason:</span>
                  <span className="font-semibold text-gray-800 text-right max-w-xs">{message.data.reason}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Claim Type:</span>
                  <span className="font-semibold text-gray-800">{message.data.claimType}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Claim Intimation Date:</span>
                  <span className="font-semibold text-gray-800">{message.data.claimIntimationDate}</span>
                </div>
                <div className="flex justify-between pt-2 bg-green-50 -mx-4 px-4 py-3 -mb-4 rounded-b-lg">
                  <span className="text-gray-700 font-semibold">Claim Payment Amount:</span>
                  <span className="font-bold text-green-600 text-xl">$ {message.data.compensationAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "lost-item-declaration-info":
        return (
          <div key={message.id} className="ml-13 mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Lost Item Declaration Required</span>
              </div>
              <p className="text-sm text-gray-700 mb-3">Please provide a written statement describing:</p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                <li>Date and Time of Loss / Theft</li>
                <li>Location of incident</li>
                <li>Detailed explanation of what happened</li>
                <li>List of Lost / Stolen documents</li>
              </ul>
            </div>
          </div>
        );

      case "postpone-documents-info":
        return (
          <div key={message.id} className="ml-13 mb-4">
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 max-w-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-teal-600" />
                <span className="font-semibold text-teal-800">Upload Documents for following:</span>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 ml-2">
                <li>Additional administrative charges by the tour operators</li>
                <li>Additional transport expenses</li>
                <li>Additional accommodation expenses</li>
                <li>Letter requesting for refund of any prepaid charges/expenses - with a decision</li>
                <li className="text-gray-500">Death Certificate <span className="italic">* optional for initial payment</span></li>
              </ul>
            </div>
          </div>
        );

      case "cancel-documents-info":
        return (
          <div key={message.id} className="ml-13 mb-4">
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 max-w-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-teal-600" />
                <span className="font-semibold text-teal-800">Upload Documents for following:</span>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 ml-2">
                <li>Cancellation administrative charges by the tour operators</li>
                <li>Cancellation charges for transport</li>
                <li>Cancellation charges for accommodation expenses</li>
                <li>Letter requesting for refund of any prepaid charges/expenses - with a decision of payment</li>
                <li className="text-gray-500">Death Certificate <span className="italic">* optional for initial payment</span></li>
              </ul>
            </div>
          </div>
        );

      case "shorten-documents-info":
        return (
          <div key={message.id} className="ml-13 mb-4">
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 max-w-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-teal-600" />
                <span className="font-semibold text-teal-800">Upload Documents for following:</span>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 ml-2">
                <li>Additional administrative charges by the tour operators</li>
                <li>Additional transport expenses for return</li>
                <li>Additional accommodation expenses</li>
                <li>Letter requesting for refund of any prepaid charges/expenses - with a decision of payment</li>
                <li className="text-gray-500">Death Certificate <span className="italic">* optional for initial payment</span></li>
              </ul>
            </div>
          </div>
        );

      case "disruption-documents-info":
        return (
          <div key={message.id} className="ml-13 mb-4">
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 max-w-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-rose-600" />
                <span className="font-semibold text-rose-800">Upload Documents for following:</span>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 ml-2">
                <li>Cardiac arrest report for insured by a medical practitioner</li>
                <li>New Tickets & Invoice</li>
                <li>Additional Accommodation Invoice</li>
                <li>Letter requesting for refund of any prepaid charges/expenses- with a decision of payment</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ backgroundColor: '#C2E6F5' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#FF7E00', borderBottom: '1px solid #E67000' }} className="py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://customer-assets.emergentagent.com/job_luggage-tracker-4/artifacts/17l1tx1m_image.png" 
              alt="Income Insurance" 
              className="h-10 w-auto"
            />
          </div>
          <div className="text-center flex items-center gap-2">
            <img 
              src="https://customer-assets.emergentagent.com/job_travel-claims-flow/artifacts/vsbkds6u_image.png"
              alt="Jiffy Jane"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-white font-semibold">Jiffy Jane</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-semibold">{user.name}</p>
              <p className="text-white/80 text-sm">{user.policy_number}</p>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={onLogout}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 flex flex-col overflow-hidden">
        {/* Initiate New Claim Button */}
        <div className="flex justify-end mb-2 flex-shrink-0">
          <button
            onClick={handleInitiateNewClaim}
            style={{ backgroundColor: '#F96302' }}
            className="flex items-center gap-2 hover:opacity-90 text-white rounded-lg px-4 py-2 transition-all shadow-md"
            data-testid="initiate-new-claim-btn"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="font-medium">Initiate New Claim</span>
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex-1 flex flex-col">
          {/* Messages Area - Fills available space */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.map((message) => renderMessage(message))}

            {/* Options Buttons */}
            {currentStep === "options" && (
              <div className="flex flex-wrap gap-3 ml-13 mt-4">
                <button
                  onClick={() => handleOptionClick("baggage")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                  data-testid="baggage-delayed-btn"
                >
                  <Briefcase className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Baggage Delayed</span>
                </button>
                <button
                  onClick={() => handleOptionClick("baggage-loss")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                  data-testid="baggage-loss-btn"
                >
                  <Luggage className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Baggage Loss/Damage</span>
                </button>
                <button
                  onClick={() => handleOptionClick("documents")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                  data-testid="lost-documents-btn"
                >
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Lost Travel Documents</span>
                </button>
                <button
                  onClick={() => handleOptionClick("medical")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                  data-testid="medical-emergency-btn"
                >
                  <AlertTriangle className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Medical Expenses</span>
                </button>
                <button
                  onClick={() => handleOptionClick("postpone-trip")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                  data-testid="postpone-trip-btn"
                >
                  <CalendarX className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Postponing the Trip</span>
                </button>
                <button
                  onClick={() => handleOptionClick("cancel-trip")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                  data-testid="cancel-trip-btn"
                >
                  <CalendarX className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Cancelling the Trip</span>
                </button>
                <button
                  onClick={() => handleOptionClick("shorten-trip")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                  data-testid="shorten-trip-btn"
                >
                  <CalendarMinus className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Shortening the Trip</span>
                </button>
                <button
                  onClick={() => handleOptionClick("trip-disruption")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                  data-testid="trip-disruption-btn"
                >
                  <AlertCircle className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Trip Disruption</span>
                </button>
              </div>
            )}

            {/* Flight Selection Confirm Button - Baggage Delayed */}
            {currentStep === "select-flight" && (
              <div className="ml-13 mt-4">
                <button
                  onClick={() => handleFlightClick(selectedFlight)}
                  disabled={!selectedFlight}
                  style={{ backgroundColor: selectedFlight ? '#F96302' : undefined }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                    selectedFlight
                      ? "hover:opacity-90 text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  data-testid="confirm-flight-btn"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Proceed</span>
                </button>
              </div>
            )}

            {/* Flight Selection Confirm Button - Baggage Loss/Damage */}
            {currentStep === "select-flight-baggage-loss" && (
              <div className="ml-13 mt-4">
                <button
                  onClick={() => handleFlightClick(selectedFlight)}
                  disabled={!selectedFlight}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    selectedFlight
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  data-testid="confirm-flight-baggage-loss-btn"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Proceed</span>
                </button>
              </div>
            )}

            {/* Delay Hours Selection - Baggage Delayed */}
            {currentStep === "ask-delay-hours" && (
              <div className="flex flex-wrap gap-3 ml-13 mt-4">
                {[6, 8, 12, 18, 20, 24].map((hours) => (
                  <button
                    key={hours}
                    onClick={() => handleDelayHoursSubmit(hours)}
                    className="bg-white border border-gray-200 rounded-lg px-5 py-3 hover:bg-orange-50 hover:border-orange-300 transition-colors"
                    data-testid={`delay-${hours}-hours-btn`}
                  >
                    <span className="text-gray-700 font-medium">{hours} hours</span>
                  </button>
                ))}
              </div>
            )}

            {/* Delay Hours Selection - Baggage Loss/Damage */}
            {currentStep === "ask-delay-hours-baggage-loss" && (
              <div className="flex flex-wrap gap-3 ml-13 mt-4">
                <button
                  onClick={() => handleDelayOptionSelect("15-hours")}
                  className="bg-white border border-gray-200 rounded-lg px-5 py-3 hover:bg-amber-50 hover:border-amber-300 transition-colors"
                  data-testid="delay-15-hours-btn"
                >
                  <span className="text-gray-700 font-medium">15 hours</span>
                </button>
                <button
                  onClick={() => handleDelayOptionSelect("2-days")}
                  className="bg-white border border-gray-200 rounded-lg px-5 py-3 hover:bg-amber-50 hover:border-amber-300 transition-colors"
                  data-testid="delay-2-days-btn"
                >
                  <span className="text-gray-700 font-medium">2 days</span>
                </button>
                <button
                  onClick={() => handleDelayOptionSelect("lost-missing")}
                  className="bg-white border border-gray-200 rounded-lg px-5 py-3 hover:bg-red-50 hover:border-red-300 transition-colors"
                  data-testid="delay-lost-missing-btn"
                >
                  <span className="text-gray-700 font-medium">Lost/Missing</span>
                </button>
              </div>
            )}

            {/* Document Upload */}
            {(currentStep === "upload-document" || currentStep === "upload-document-baggage-loss") && (
              <div className="ml-13 mt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={currentStep === "upload-document-baggage-loss" ? handleFileUploadBaggageLoss : handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ backgroundColor: currentStep === "upload-document-baggage-loss" ? '#F59E0B' : '#F96302' }}
                  className="flex items-center gap-2 hover:opacity-90 text-white rounded-lg px-6 py-3 transition-all"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Upload PIR Document</span>
                </button>
                <p className="text-sm text-gray-500 mt-2">Accepted formats: PDF, JPG, PNG, DOC, DOCX</p>
              </div>
            )}

            {/* Document Type Selection */}
            {currentStep === "select-document-type" && (
              <div className="flex flex-wrap gap-3 ml-13 mt-4">
                <button
                  onClick={() => handleDocumentTypeSelect("passport")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  data-testid="passport-btn"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Passport</span>
                </button>
                <button
                  onClick={() => handleDocumentTypeSelect("other")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  data-testid="other-document-btn"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Other Document</span>
                </button>
              </div>
            )}

            {/* Medical Type Selection */}
            {currentStep === "select-medical-type" && (
              <div className="flex flex-wrap gap-3 ml-13 mt-4">
                <button
                  onClick={() => handleMedicalTypeSelect("hospitalization")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-red-50 hover:border-red-300 transition-colors"
                  data-testid="hospitalization-btn"
                >
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-gray-700">Hospitalization</span>
                </button>
                <button
                  onClick={() => handleMedicalTypeSelect("outpatient")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-red-50 hover:border-red-300 transition-colors"
                  data-testid="outpatient-btn"
                >
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-gray-700">Outpatient Treatment</span>
                </button>
                <button
                  onClick={() => handleMedicalTypeSelect("emergency")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-red-50 hover:border-red-300 transition-colors"
                  data-testid="emergency-btn"
                >
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-gray-700">Emergency Treatment</span>
                </button>
                <button
                  onClick={() => handleMedicalTypeSelect("medication")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-red-50 hover:border-red-300 transition-colors"
                  data-testid="medication-btn"
                >
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-gray-700">Medication Purchase</span>
                </button>
              </div>
            )}

            {/* Postpone Trip Reason Selection */}
            {currentStep === "select-postpone-reason" && (
              <div className="flex flex-wrap gap-3 ml-13 mt-4">
                <button
                  onClick={() => handlePostponeReasonSelect("death-serious-sickness")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="postpone-death-serious-sickness-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Death/ Serious Sickness</span>
                </button>
                <button
                  onClick={() => handlePostponeReasonSelect("government-stop")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="government-stop-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Government Authorities stopping travel</span>
                </button>
                <button
                  onClick={() => handlePostponeReasonSelect("riot-strike")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="riot-strike-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Riot/Strike/Civil Commotion</span>
                </button>
                <button
                  onClick={() => handlePostponeReasonSelect("natural-disaster")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="natural-disaster-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Natural Disaster</span>
                </button>
                <button
                  onClick={() => handlePostponeReasonSelect("home-damage")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="home-damage-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Serious Damage to home</span>
                </button>
                <button
                  onClick={() => handlePostponeReasonSelect("court-appearance")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="court-appearance-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Court Appearance</span>
                </button>
                <button
                  onClick={() => handlePostponeReasonSelect("child-guardian")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="child-guardian-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Child traveler – guardian cancels trip</span>
                </button>
              </div>
            )}

            {/* Postpone Documents Upload */}
            {currentStep === "upload-postpone-documents" && (
              <div className="ml-13 mt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePostponeDocumentsUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
                <input
                  type="file"
                  ref={deathCertInputRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPostponeDeathCert(file.name);
                      addMessage({
                        type: "user",
                        content: `Uploaded Death Certificate: ${file.name}`,
                      });
                    }
                  }}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg px-6 py-3 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="font-medium">Upload Document ({postponeDocuments.length}/4)</span>
                  </button>
                  <span className={`text-sm font-medium ${postponeDocuments.length >= 4 ? 'text-green-600' : 'text-orange-600'}`}>
                    {postponeDocuments.length >= 4 ? '✓ All mandatory documents uploaded' : `${4 - postponeDocuments.length} more required`}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Please upload all 4 required documents (PDF, JPG, PNG, DOC, DOCX)</p>
                
                {/* Optional Death Certificate Upload */}
                <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-dashed border-gray-300">
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => deathCertInputRef.current?.click()}
                      className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-2 transition-colors text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Death Certificate (Optional)</span>
                    </button>
                    {postponeDeathCert ? (
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> {postponeDeathCert}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 italic">* optional for initial payment</span>
                    )}
                  </div>
                </div>

                {postponeDocuments.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Uploaded mandatory documents:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {postponeDocuments.map((doc, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Postpone Trip - Ready to Proceed */}
            {currentStep === "postpone-ready-to-proceed" && (
              <div className="ml-13 mt-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Uploaded documents:</p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    {postponeDocuments.map((doc, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={processPostponeClaim}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg px-6 py-3 transition-colors font-medium"
                      data-testid="postpone-proceed-claim-btn"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Proceed with Claim</span>
                    </button>
                    <button
                      onClick={() => deathCertInputRef.current?.click()}
                      className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-3 transition-colors font-medium"
                      data-testid="postpone-upload-death-cert-btn"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Upload Death Certificate (Optional)</span>
                    </button>
                  </div>
                  {postponeDeathCert && (
                    <p className="text-sm text-green-600 mt-3 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Death Certificate uploaded: {postponeDeathCert}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Cancel Trip Reason Selection */}
            {currentStep === "select-cancel-reason" && (
              <div className="flex flex-wrap gap-3 ml-13 mt-4">
                <button
                  onClick={() => handleCancelReasonSelect("death-serious-sickness")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="cancel-death-serious-sickness-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Death / Serious Sickness</span>
                </button>
                <button
                  onClick={() => handleCancelReasonSelect("government-stop")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="cancel-government-stop-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Government Authorities stopping travel</span>
                </button>
                <button
                  onClick={() => handleCancelReasonSelect("riot-strike")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="cancel-riot-strike-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Riot/Strike/Civil Commotion</span>
                </button>
                <button
                  onClick={() => handleCancelReasonSelect("natural-disaster")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="cancel-natural-disaster-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Natural Disaster</span>
                </button>
                <button
                  onClick={() => handleCancelReasonSelect("home-damage")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="cancel-home-damage-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Serious Damage to home</span>
                </button>
                <button
                  onClick={() => handleCancelReasonSelect("court-appearance")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="cancel-court-appearance-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Court Appearance</span>
                </button>
                <button
                  onClick={() => handleCancelReasonSelect("child-guardian")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="cancel-child-guardian-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Child traveler – guardian cancels trip</span>
                </button>
              </div>
            )}

            {/* Cancel Documents Upload */}
            {currentStep === "upload-cancel-documents" && (
              <div className="ml-13 mt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCancelDocumentsUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
                <input
                  type="file"
                  ref={deathCertInputRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setCancelDeathCert(file.name);
                      addMessage({
                        type: "user",
                        content: `Uploaded Death Certificate: ${file.name}`,
                      });
                    }
                  }}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg px-6 py-3 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="font-medium">Upload Document ({cancelDocuments.length}/4)</span>
                  </button>
                  <span className={`text-sm font-medium ${cancelDocuments.length >= 4 ? 'text-green-600' : 'text-orange-600'}`}>
                    {cancelDocuments.length >= 4 ? '✓ All mandatory documents uploaded' : `${4 - cancelDocuments.length} more required`}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Please upload all 4 required documents (PDF, JPG, PNG, DOC, DOCX)</p>
                
                {/* Optional Death Certificate Upload */}
                <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-dashed border-gray-300">
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => deathCertInputRef.current?.click()}
                      className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-2 transition-colors text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Death Certificate (Optional)</span>
                    </button>
                    {cancelDeathCert ? (
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> {cancelDeathCert}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 italic">* optional for initial payment</span>
                    )}
                  </div>
                </div>

                {cancelDocuments.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Uploaded mandatory documents:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {cancelDocuments.map((doc, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Cancel Trip - Ready to Proceed */}
            {currentStep === "cancel-ready-to-proceed" && (
              <div className="ml-13 mt-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Uploaded documents:</p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    {cancelDocuments.map((doc, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={processCancelClaim}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg px-6 py-3 transition-colors font-medium"
                      data-testid="cancel-proceed-claim-btn"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Proceed with Claim</span>
                    </button>
                    <button
                      onClick={() => deathCertInputRef.current?.click()}
                      className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-3 transition-colors font-medium"
                      data-testid="cancel-upload-death-cert-btn"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Upload Death Certificate (Optional)</span>
                    </button>
                  </div>
                  {cancelDeathCert && (
                    <p className="text-sm text-green-600 mt-3 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Death Certificate uploaded: {cancelDeathCert}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Shorten Trip Reason Selection */}
            {currentStep === "select-shorten-reason" && (
              <div className="flex flex-wrap gap-3 ml-13 mt-4">
                <button
                  onClick={() => handleShortenReasonSelect("death-serious-sickness")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="shorten-death-serious-sickness-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Death / Serious Sickness</span>
                </button>
                <button
                  onClick={() => handleShortenReasonSelect("government-stop")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="shorten-government-stop-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Government Authorities stopping travel</span>
                </button>
                <button
                  onClick={() => handleShortenReasonSelect("riot-strike")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="shorten-riot-strike-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Riot/Strike/Civil Commotion</span>
                </button>
                <button
                  onClick={() => handleShortenReasonSelect("natural-disaster")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="shorten-natural-disaster-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Natural Disaster</span>
                </button>
                <button
                  onClick={() => handleShortenReasonSelect("home-damage")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="shorten-home-damage-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Serious Damage to home</span>
                </button>
                <button
                  onClick={() => handleShortenReasonSelect("court-appearance")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="shorten-court-appearance-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Court Appearance</span>
                </button>
                <button
                  onClick={() => handleShortenReasonSelect("child-guardian")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                  data-testid="shorten-child-guardian-btn"
                >
                  <AlertCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Child traveler – guardian cancels trip</span>
                </button>
              </div>
            )}

            {/* Shorten Documents Upload */}
            {currentStep === "upload-shorten-documents" && (
              <div className="ml-13 mt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleShortenDocumentsUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
                <input
                  type="file"
                  ref={deathCertInputRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setShortenDeathCert(file.name);
                      addMessage({
                        type: "user",
                        content: `Uploaded Death Certificate: ${file.name}`,
                      });
                    }
                  }}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg px-6 py-3 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="font-medium">Upload Document ({shortenDocuments.length}/4)</span>
                  </button>
                  <span className={`text-sm font-medium ${shortenDocuments.length >= 4 ? 'text-green-600' : 'text-orange-600'}`}>
                    {shortenDocuments.length >= 4 ? '✓ All mandatory documents uploaded' : `${4 - shortenDocuments.length} more required`}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Please upload all 4 required documents (PDF, JPG, PNG, DOC, DOCX)</p>
                
                {/* Optional Death Certificate Upload */}
                <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-dashed border-gray-300">
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => deathCertInputRef.current?.click()}
                      className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-2 transition-colors text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Death Certificate (Optional)</span>
                    </button>
                    {shortenDeathCert ? (
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> {shortenDeathCert}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 italic">* optional for initial payment</span>
                    )}
                  </div>
                </div>

                {shortenDocuments.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Uploaded mandatory documents:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {shortenDocuments.map((doc, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Shorten Trip - Ready to Proceed */}
            {currentStep === "shorten-ready-to-proceed" && (
              <div className="ml-13 mt-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Uploaded documents:</p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    {shortenDocuments.map((doc, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={processShortenClaim}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg px-6 py-3 transition-colors font-medium"
                      data-testid="shorten-proceed-claim-btn"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Proceed with Claim</span>
                    </button>
                    <button
                      onClick={() => deathCertInputRef.current?.click()}
                      className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-3 transition-colors font-medium"
                      data-testid="shorten-upload-death-cert-btn"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Upload Death Certificate (Optional)</span>
                    </button>
                  </div>
                  {shortenDeathCert && (
                    <p className="text-sm text-green-600 mt-3 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Death Certificate uploaded: {shortenDeathCert}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Document Upload for Lost Documents */}
            {currentStep === "upload-document-proof" && (
              <div className="ml-13 mt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleDocumentProofUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6 py-3 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Upload Police Report / Loss Report</span>
                </button>
                <p className="text-sm text-gray-500 mt-2">Accepted formats: PDF, JPG, PNG, DOC, DOCX</p>
              </div>
            )}

            {/* Medical Document Upload */}
            {currentStep === "upload-medical-document" && (
              <div className="ml-13 mt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMedicalDocumentUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-lg px-6 py-3 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Upload Medical Bills / Reports</span>
                </button>
                <p className="text-sm text-gray-500 mt-2">Accepted formats: PDF, JPG, PNG, DOC, DOCX</p>
              </div>
            )}

            {/* Proof of Travel Upload */}
            {currentStep === "upload-proof-of-travel" && (
              <div className="ml-13 mt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProofOfTravelUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6 py-3 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Upload Proof of Travel</span>
                </button>
                <p className="text-sm text-gray-500 mt-2">E.g., flight tickets, boarding passes, hotel bookings (PDF, JPG, PNG, DOC, DOCX)</p>
              </div>
            )}

            {/* Lost Item Declaration Upload */}
            {currentStep === "upload-lost-item-declaration" && (
              <div className="ml-13 mt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLostItemDeclarationUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6 py-3 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Upload Lost Item Declaration</span>
                </button>
                <p className="text-sm text-gray-500 mt-2">Written statement with date, location, details of loss (PDF, JPG, PNG, DOC, DOCX)</p>
              </div>
            )}

            {/* Baggage Loss/Damage Upload */}
            {currentStep === "upload-baggage-loss-docs" && (
              <div className="ml-13 mt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleGenericDocUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-6 py-3 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Upload PIR & Photos</span>
                </button>
                <p className="text-sm text-gray-500 mt-2">Property Irregularity Report (PIR) and photos of damage (PDF, JPG, PNG)</p>
              </div>
            )}

            {/* Trip Postponement Upload */}
            {currentStep === "upload-postpone-docs" && (
              <div className="ml-13 mt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleGenericDocUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg px-6 py-3 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Upload Supporting Documents</span>
                </button>
                <p className="text-sm text-gray-500 mt-2">Medical certificates, official letters, or proof of reason (PDF, JPG, PNG)</p>
              </div>
            )}

            {/* Trip Cancellation Upload */}
            {currentStep === "upload-cancel-docs" && (
              <div className="ml-13 mt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleGenericDocUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg px-6 py-3 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Upload Supporting Documents</span>
                </button>
                <p className="text-sm text-gray-500 mt-2">Cancellation receipts, medical certificates, or proof of reason (PDF, JPG, PNG)</p>
              </div>
            )}

            {/* Trip Shortening Upload */}
            {currentStep === "upload-shorten-docs" && (
              <div className="ml-13 mt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleGenericDocUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg px-6 py-3 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Upload Supporting Documents</span>
                </button>
                <p className="text-sm text-gray-500 mt-2">New flight tickets, medical certificates, or proof of reason (PDF, JPG, PNG)</p>
              </div>
            )}

            {/* Trip Disruption Reason Selection */}
            {currentStep === "select-disruption-reason" && (
              <div className="flex flex-wrap gap-3 ml-13 mt-4">
                <button
                  onClick={() => handleDisruptionReasonSelect("serious-sickness")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                  data-testid="serious-sickness-btn"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span className="text-gray-700">Serious Sickness (You/Travel Companion)</span>
                </button>
                <button
                  onClick={() => handleDisruptionReasonSelect("government-stop")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                  data-testid="disruption-government-stop-btn"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span className="text-gray-700">Government Authorities stopping travel</span>
                </button>
                <button
                  onClick={() => handleDisruptionReasonSelect("riot-strike")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                  data-testid="disruption-riot-strike-btn"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span className="text-gray-700">Riot/Strike/Civil Commotion</span>
                </button>
                <button
                  onClick={() => handleDisruptionReasonSelect("natural-disaster")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                  data-testid="disruption-natural-disaster-btn"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span className="text-gray-700">Natural Disaster</span>
                </button>
                <button
                  onClick={() => handleDisruptionReasonSelect("home-damage")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                  data-testid="disruption-home-damage-btn"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span className="text-gray-700">Serious Damage to home</span>
                </button>
                <button
                  onClick={() => handleDisruptionReasonSelect("court-appearance")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                  data-testid="disruption-court-appearance-btn"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span className="text-gray-700">Court Appearance</span>
                </button>
                <button
                  onClick={() => handleDisruptionReasonSelect("child-guardian")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                  data-testid="disruption-child-guardian-btn"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span className="text-gray-700">Child traveler – guardian cancels trip</span>
                </button>
              </div>
            )}

            {/* Trip Disruption Documents Upload */}
            {currentStep === "upload-disruption-documents" && (
              <div className="ml-13 mt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleDisruptionDocumentsUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg px-6 py-3 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="font-medium">Upload Document ({disruptionDocuments.length}/4)</span>
                  </button>
                  <span className={`text-sm font-medium ${disruptionDocuments.length >= 4 ? 'text-green-600' : 'text-orange-600'}`}>
                    {disruptionDocuments.length >= 4 ? '✓ All documents uploaded' : `${4 - disruptionDocuments.length} more required`}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Please upload all 4 required documents (PDF, JPG, PNG, DOC, DOCX)</p>
                {disruptionDocuments.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Uploaded documents:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {disruptionDocuments.map((doc, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {isTyping && (
              <div className="flex items-center gap-2 text-gray-500 ml-13">
                <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-orange-500 rounded-full" />
                <span className="text-sm">Agent is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={currentStep === "ask-delay-hours" || currentStep === "ask-delay-hours-baggage-loss"}
                placeholder={
                  currentStep === "select-flight" || currentStep === "select-flight-baggage-loss"
                    ? "Enter flight number (e.g., SQ883)" 
                    : currentStep === "ask-delay-hours"
                    ? "Please select an option above"
                    : currentStep === "ask-delay-hours-baggage-loss"
                    ? "Please select an option above"
                    : "Type your message..."
                }
                className={`flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  (currentStep === "ask-delay-hours" || currentStep === "ask-delay-hours-baggage-loss") 
                    ? "bg-gray-100 cursor-not-allowed" 
                    : ""
                }`}
              />
              <button
                onClick={handleSendMessage}
                disabled={currentStep === "ask-delay-hours" || currentStep === "ask-delay-hours-baggage-loss"}
                style={{ backgroundColor: (currentStep === "ask-delay-hours" || currentStep === "ask-delay-hours-baggage-loss") ? undefined : '#F96302' }}
                className={`p-3 rounded-lg transition-all ${
                  (currentStep === "ask-delay-hours" || currentStep === "ask-delay-hours-baggage-loss")
                    ? "bg-gray-300 cursor-not-allowed"
                    : "hover:opacity-90 text-white"
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
