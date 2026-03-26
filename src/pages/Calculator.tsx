import MortgageCalc from '../components/MortgageCalc'

export default function Calculator() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-ms-navy text-white px-4 py-3">
        <h1 className="font-bold text-lg">Mortgage Calculator</h1>
        <p className="text-xs text-gray-300">Estimate your monthly payment</p>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <MortgageCalc />
        </div>

        <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-ms-navy text-sm mb-3">Quick Tips</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">
              <span className="text-ms-red font-bold">1.</span>
              A 20% down payment avoids PMI (private mortgage insurance)
            </li>
            <li className="flex gap-2">
              <span className="text-ms-red font-bold">2.</span>
              Property taxes in Georgia average about 1.1% of home value
            </li>
            <li className="flex gap-2">
              <span className="text-ms-red font-bold">3.</span>
              A lower interest rate can save tens of thousands over the loan
            </li>
            <li className="flex gap-2">
              <span className="text-ms-red font-bold">4.</span>
              15-year loans have higher payments but much less total interest
            </li>
          </ul>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Estimates are for informational purposes only. Contact a Mark Spain agent for precise figures.
        </p>
      </div>
    </div>
  )
}
