import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Plane, Clock, MapPin, AlertTriangle, Cloud } from "lucide-react";
import { Badge } from "./ui/badge";

const FlightInfoPanel = ({ flightData }) => {
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="glass-card overflow-hidden" data-testid="flight-info-panel">
        <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-outfit">
            <Plane className="w-5 h-5" />
            Flight Information
          </CardTitle>
          {flightData && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                Booking: {flightData.booking_reference}
              </Badge>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {!flightData ? (
            <div className="text-center py-8 text-slate-500" data-testid="flight-placeholder">
              <Plane className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Flight details will appear when workflow starts</p>
            </div>
          ) : (
            <>
              {/* Journey Date */}
              <div className="text-center pb-3 border-b border-slate-200">
                <p className="text-sm text-slate-500">Journey Date</p>
                <p className="font-semibold text-slate-800" data-testid="journey-date">
                  {formatDate(flightData.journey_date)}
                </p>
              </div>

              {/* Flight Route Visualization */}
              <div className="flight-route py-4" data-testid="flight-route">
                {/* SIN Node */}
                <div className="flight-node">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">SIN</span>
                  </div>
                  <span className="text-xs text-slate-500 text-center">Singapore</span>
                </div>

                {/* First Connector - CANCELLED */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="flex items-center w-full">
                    <div className="flex-1 h-0.5 bg-red-300" />
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-1">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 h-0.5 bg-red-300" />
                  </div>
                  <span className="text-xs text-red-600 font-medium mt-1">CANCELLED</span>
                </div>

                {/* HAK Node */}
                <div className="flight-node">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center border-2 border-red-300">
                    <span className="text-red-600 font-bold text-lg">HAK</span>
                  </div>
                  <span className="text-xs text-slate-500 text-center">Haikou</span>
                </div>

                {/* Second Connector - AFFECTED */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="flex items-center w-full">
                    <div className="flex-1 h-0.5 bg-amber-300" />
                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center mx-1">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-amber-300" />
                  </div>
                  <span className="text-xs text-amber-600 font-medium mt-1">AFFECTED</span>
                </div>

                {/* NRT Node */}
                <div className="flight-node">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-slate-600 font-bold text-lg">NRT</span>
                  </div>
                  <span className="text-xs text-slate-500 text-center">Tokyo</span>
                </div>
              </div>

              {/* Flight Segments */}
              <div className="space-y-3">
                {flightData.segments.map((segment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className={`p-3 rounded-xl border ${
                      segment.status === "CANCELLED"
                        ? "bg-red-50 border-red-200"
                        : "bg-amber-50 border-amber-200"
                    }`}
                    data-testid={`flight-segment-${index}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          segment.airline_code === "SQ" ? "bg-blue-600" : "bg-indigo-600"
                        }`}>
                          <Plane className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{segment.flight_number}</p>
                          <p className="text-xs text-slate-500">{segment.airline}</p>
                        </div>
                      </div>
                      <Badge
                        className={`${
                          segment.status === "CANCELLED"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-amber-100 text-amber-700 border-amber-200"
                        }`}
                      >
                        {segment.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="text-center">
                        <p className="font-bold text-slate-800">{segment.departure_airport}</p>
                        <p className="text-xs text-slate-500">{formatDateTime(segment.scheduled_departure)}</p>
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-slate-300 rounded-full" />
                          <div className="w-16 h-0.5 bg-slate-300" />
                          <Plane className="w-4 h-4 text-slate-400" />
                          <div className="w-16 h-0.5 bg-slate-300" />
                          <div className="w-2 h-2 bg-slate-300 rounded-full" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-slate-800">{segment.arrival_airport}</p>
                        <p className="text-xs text-slate-500">{formatDateTime(segment.scheduled_arrival)}</p>
                      </div>
                    </div>

                    {segment.status_reason && (
                      <div className="mt-2 flex items-start gap-2 text-xs">
                        <Cloud className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className={segment.status === "CANCELLED" ? "text-red-600" : "text-amber-600"}>
                          {segment.status_reason}
                        </span>
                      </div>
                    )}

                    {segment.terminal && segment.gate && (
                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Terminal {segment.terminal}
                        </span>
                        <span>Gate {segment.gate}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* API Source */}
              <div className="pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Data source: {flightData.api_source}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  API Call ID: {flightData.api_call_id}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FlightInfoPanel;
