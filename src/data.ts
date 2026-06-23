import { InvestmentProduct } from './types';

export const productsList: InvestmentProduct[] = [
  {
    id: 'prod-apple-1500',
    name: 'XENA Bronze Package',
    description: 'Premier defensive entry-tier allocation. Defer ₦1,500 to yield ₦400 daily passive revenue (₦12,000 total payout after 30 days).',
    minAmount: 1500,
    maxAmount: 1500,
    rate: 0.26666666666666666, // 400 daily -> 400 / 1500 = 26.67% daily
    termDays: 30,
    riskLevel: 'Low',
    category: 'Bronze Tier'
  },
  {
    id: 'prod-samsung-3k',
    name: 'XENA Silver Package',
    description: 'Silver-tier compounding wealth engine. Defer ₦3,000 to yield ₦800 daily passive revenue (₦24,000 total payout after 30 days).',
    minAmount: 3000,
    maxAmount: 3000,
    rate: 0.26666666666666666, // 800 daily -> 800 / 3000 = 26.67% daily
    termDays: 30,
    riskLevel: 'Low',
    category: 'Silver Tier'
  },
  {
    id: 'prod-nvidia-5k',
    name: 'XENA Gold Package',
    description: 'Golden-standard performance plan. Defer ₦5,000 to yield ₦1,300 daily passive revenue (₦39,000 total payout after 30 days).',
    minAmount: 5000,
    maxAmount: 5000,
    rate: 0.26, // 1,300 daily -> 1300 / 5000 = 26.0% daily
    termDays: 30,
    riskLevel: 'Low',
    category: 'Gold Tier'
  },
  {
    id: 'prod-tesla-10k',
    name: 'XENA Platinum Option',
    description: 'Elite corporate executive instrument. Defer ₦10,005 to yield ₦2,500 daily passive revenue (₦75,000 total payout after 30 days).',
    minAmount: 10000,
    maxAmount: 10000,
    rate: 0.25, // 2,500 daily -> 2500 / 10000 = 25.0% daily
    termDays: 30,
    riskLevel: 'Low',
    category: 'Platinum Tier'
  },
  {
    id: 'prod-microsoft-20k',
    name: 'XENA Diamond Allocation',
    description: 'Premium wealth sovereignty account. Defer ₦20,000 to yield ₦5,000 daily passive revenue (₦150,000 total payout after 30 days).',
    minAmount: 20000,
    maxAmount: 20000,
    rate: 0.25, // 5,000 daily -> 5000 / 20000 = 25.0% daily
    termDays: 30,
    riskLevel: 'Low',
    category: 'Diamond Tier'
  },
  {
    id: 'prod-alphabet-30k',
    name: 'XENA Elite Corporate VIP',
    description: 'Ultimate master-class treasury allocation. Defer ₦30,000 to yield ₦7,800 daily passive revenue (₦234,000 total payout after 30 days).',
    minAmount: 30000,
    maxAmount: 30000,
    rate: 0.26, // 7,800 daily -> 7800 / 30000 = 26.0% daily
    termDays: 30,
    riskLevel: 'Moderate',
    category: 'VIP Tier'
  }
];

export const faqList = [
  {
    question: 'How do the XENA investment returns work?',
    answer: 'Once you acquire a premium XENA wealth package (like XENA Bronze, Silver, Gold, or Elite Corporate), your funds are immediately deployed. For every day, you receive a guaranteed outstanding daily dividend payout based on your chosen option. Each options plan runs for a fixed 30-day term cycle, bringing exceptional compound yields (e.g., ₦1,500 Bronze tier package yields ₦12,000, and ₦30,000 VIP package yields ₦234,000 gross returned upon maturity).'
  },
  {
    question: 'Is compounding available for these shares?',
    answer: 'Yes! Automated rollover compounding allows you to automatically reinvest your daily returns or the entire mature capital into another term cycle, allowing you to build heavy compound yield on your XENA options.'
  },
  {
    question: 'How do I fund my XENA wallet?',
    answer: 'Deposits can be made instantly via simulated Nigerian bank transfers (GTBank, Zenith, Access Bank, etc.) or card payments. Your account is credited instantly in Naira (₦) with a minimum deposit of ₦1,000.'
  },
  {
    question: 'Are withdrawals processed smoothly?',
    answer: 'Absolutely. On maturity, cumulative returns are immediately available. You can request a payout directly to any registered bank account in Nigeria with a minimum withdrawal amount of ₦2,000.'
  }
];
