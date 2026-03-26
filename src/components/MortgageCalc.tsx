import { useState, useMemo } from 'react'
import { calculateMortgage, MortgageResult } from '../utils/mortgage'

interface Props {
  defaultPrice?: number
}

export default function MortgageCalc({ defaultPrice = 400000 }: Props) {
  const [price, setPrice] = useState(defaultPrice)
  const [downPercent, setDownPercent] = useState(20)
  const [rate, setRate] = useState(6.5)
  const [term, setTerm] = useState(30)

  const result: MortgageResult = useMemo(
    () => calculateMortgage({ homePrice: price, downPaymentPercent: downPercent, interestRate: rate, loanTermYears: term }),
    [price, downPercent, rate, term]
  )

  const total = result.monthlyPI + result.monthlyTax + result.monthlyInsurance
  const piPercent = Math.round((result.monthlyPI / total) * 100)
  const taxPercent = Math.round((result.monthlyTax / total) * 100)
  const insPercent = 100 - piPercent - taxPercent

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Home Price</label>
        <input
          type="range"
          min={100000}
          max={1000000}
          step={5000}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full accent-ms-red"
        />
        <p className="text-right text-sm font-semibold text-ms-navy">${price.toLocaleString()}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment</label>
        <input
          type="range"
          min={0}
          max={50}
          step={1}
          value={downPercent}
          onChange={(e) => setDownPercent(Number(e.target.value))}
          className="w-full accent-ms-red"
        />
        <p className="text-right text-sm font-semibold text-ms-navy">
          {downPercent}% (${result.downPayment.toLocaleString()})
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate</label>
        <input
          type="range"
          min={2}
          max={10}
          step={0.125}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full accent-ms-red"
        />
        <p className="text-right text-sm font-semibold text-ms-navy">{rate.toFixed(3)}%</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term</label>
        <div className="flex gap-2">
          {[15, 20, 30].map((t) => (
            <button
              key={t}
              onClick={() => setTerm(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                term === t ? 'bg-ms-red text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t} yr
            </button>
          ))}
        </div>
      </div>

      <div className="bg-ms-navy rounded-xl p-4 text-white mt-4">
        <p className="text-sm text-gray-300">Estimated Monthly Payment</p>
        <p className="text-3xl font-bold mt-1">${result.totalMonthly.toLocaleString()}</p>

        <div className="mt-3 h-3 rounded-full overflow-hidden flex bg-white/20">
          <div className="bg-ms-red h-full" style={{ width: `${piPercent}%` }} />
          <div className="bg-yellow-400 h-full" style={{ width: `${taxPercent}%` }} />
          <div className="bg-blue-400 h-full" style={{ width: `${insPercent}%` }} />
        </div>

        <div className="flex justify-between mt-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-ms-red rounded-full" />
            <span>P&I: ${result.monthlyPI.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            <span>Tax: ${result.monthlyTax.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span>Ins: ${result.monthlyInsurance.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
