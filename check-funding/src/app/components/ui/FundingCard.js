import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const FundingCard = ({ title, funded, rate, icon: Icon, eligible = null, reasoning = null }) => (
  <div className={`p-4 rounded-lg border-2 ${
    eligible === true ? 'border-green-200 bg-green-50' : 
    eligible === false ? 'border-red-200 bg-red-50' :
    funded ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
  }`}>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${
          eligible === true ? 'text-green-600' : 
          eligible === false ? 'text-red-600' :
          funded ? 'text-blue-600' : 'text-gray-400'
        }`} />
        <span className="font-medium text-sm">{title}</span>
      </div>
      {eligible === true ? (
        <CheckCircle className="w-5 h-5 text-green-600" />
      ) : eligible === false ? (
        <AlertCircle className="w-5 h-5 text-red-600" />
      ) : funded ? (
        <CheckCircle className="w-5 h-5 text-blue-600" />
      ) : (
        <AlertCircle className="w-5 h-5 text-gray-400" />
      )}
    </div>
    <div className="text-right mb-2">
      {funded ? (
        <span className={`text-lg font-bold ${
          eligible === true ? 'text-green-700' : 
          eligible === false ? 'text-red-700' : 'text-blue-700'
        }`}>
          £{rate.toLocaleString()}
        </span>
      ) : (
        <span className="text-sm text-gray-500">Not funded</span>
      )}
    </div>
    {reasoning && (
      <div className="text-xs text-gray-600 border-t pt-2">
        {reasoning}
      </div>
    )}
  </div>
);

export default FundingCard;