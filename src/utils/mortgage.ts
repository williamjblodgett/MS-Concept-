export interface MortgageInput {
  homePrice: number
  downPaymentPercent: number
  interestRate: number
  loanTermYears: number
}

export interface MortgageResult {
  monthlyPI: number
  monthlyTax: number
  monthlyInsurance: number
  totalMonthly: number
  loanAmount: number
  downPayment: number
  totalInterest: number
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const downPayment = input.homePrice * (input.downPaymentPercent / 100)
  const loanAmount = input.homePrice - downPayment
  const monthlyRate = input.interestRate / 100 / 12
  const numPayments = input.loanTermYears * 12

  let monthlyPI: number
  if (monthlyRate === 0) {
    monthlyPI = loanAmount / numPayments
  } else {
    monthlyPI =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
  }

  // Estimates: ~1.1% property tax, ~0.35% insurance annually
  const monthlyTax = (input.homePrice * 0.011) / 12
  const monthlyInsurance = (input.homePrice * 0.0035) / 12
  const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance
  const totalInterest = monthlyPI * numPayments - loanAmount

  return {
    monthlyPI: Math.round(monthlyPI),
    monthlyTax: Math.round(monthlyTax),
    monthlyInsurance: Math.round(monthlyInsurance),
    totalMonthly: Math.round(totalMonthly),
    loanAmount: Math.round(loanAmount),
    downPayment: Math.round(downPayment),
    totalInterest: Math.round(totalInterest),
  }
}

export function priceFromMonthlyPayment(
  monthlyPayment: number,
  downPaymentPercent = 20,
  interestRate = 6.5,
  loanTermYears = 30
): number {
  const monthlyRate = interestRate / 100 / 12
  const numPayments = loanTermYears * 12

  // Back out taxes and insurance (~1.45% annually of home price / 12)
  // monthlyPayment = PI + price*0.0145/12
  // PI = monthlyPayment - price*0.001208
  // PI = loanAmount * [r(1+r)^n / ((1+r)^n - 1)]
  // loanAmount = price * (1 - dp/100)
  // Solve iteratively
  let low = 0
  let high = monthlyPayment * 500
  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2
    const result = calculateMortgage({
      homePrice: mid,
      downPaymentPercent,
      interestRate,
      loanTermYears,
    })
    if (result.totalMonthly < monthlyPayment) {
      low = mid
    } else {
      high = mid
    }
  }
  return Math.round((low + high) / 2)
}
