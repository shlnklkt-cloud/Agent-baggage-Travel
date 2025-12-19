import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FileText, CheckCircle2, Wallet, CreditCard, DollarSign, Calendar } from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

const PolicyPanel = ({ policyData, claimData, paymentData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="glass-card overflow-hidden" data-testid="policy-panel">
        <CardHeader className="bg-gradient-to-r from-[#F96302] to-[#FF8533] text-white pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-outfit">
            <FileText className="w-5 h-5" />
            Policy & Claim Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {!policyData ? (
            <div className="text-center py-8 text-slate-500" data-testid="policy-placeholder">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Policy details will appear when verified</p>
            </div>
          ) : (
            <>
              {/* Policy Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Policy Number</span>
                  <span className="font-mono text-sm font-semibold text-slate-800" data-testid="policy-number">
                    {policyData.policy_number}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Plan Type</span>
                  <span className="text-sm font-medium text-slate-800">Premier Plan</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Status</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200" data-testid="policy-status">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {policyData.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Coverage Period</span>
                  <span className="text-xs text-slate-600">
                    {policyData.coverage_start} to {policyData.coverage_end}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Coverage Details */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#F96302]" />
                  Coverage Limits
                </h4>
                <div className="space-y-2">
                  {Object.entries(policyData.coverage_details).map(([key, value]) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        key === "flight_cancellation" ? "bg-green-50 border border-green-200" : "bg-slate-50"
                      }`}
                    >
                      <span className="text-xs text-slate-600 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className={`text-xs font-semibold ${
                        key === "flight_cancellation" ? "text-green-700" : "text-slate-700"
                      }`}>
                        SGD {value.limit.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Claim Details */}
              {claimData && (
                <>
                  <Separator />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#F96302]" />
                      Claim Status
                    </h4>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4" data-testid="claim-details">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Claim ID</span>
                        <span className="font-mono text-sm font-semibold text-slate-800">
                          {claimData.claim_id}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-slate-600">Status</span>
                        <Badge className="bg-green-500 text-white" data-testid="claim-status">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {claimData.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="text-center pt-2 border-t border-green-200">
                        <p className="text-xs text-slate-500 mb-1">Compensation Amount</p>
                        <p className="compensation-amount" data-testid="compensation-amount">
                          ${claimData.compensation_amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500">{claimData.currency}</p>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}

              {/* Payment Details */}
              {paymentData && (
                <>
                  <Separator />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      Payment Confirmation
                    </h4>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4" data-testid="payment-details">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">Payment ID</span>
                          <span className="font-mono text-xs text-slate-700">{paymentData.payment_id}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">Method</span>
                          <span className="text-xs text-slate-700">{paymentData.payment_method}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">Account</span>
                          <span className="font-mono text-xs text-slate-700">{paymentData.bank_account_masked}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">Status</span>
                          <Badge className="bg-green-500 text-white text-xs">
                            {paymentData.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-blue-200 mt-2">
                          <span className="text-xs text-slate-500">Reference</span>
                          <span className="font-mono text-xs text-blue-600">{paymentData.transaction_reference}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PolicyPanel;
