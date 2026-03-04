export interface DashboardConfig {
  // Profile
  displayName: string;
  username: string;
  avatarUrl: string;
  verified: boolean;

  // Stats
  balance: string;
  pendingBalance: string;
  subscribers: string;
  fans: string;
  tips: string;
  messages: string;
  referrals: string;

  // Earnings
  totalEarnings: string;
  subscriptionEarnings: string;
  tipEarnings: string;
  messageEarnings: string;
  referralEarnings: string;

  // Payout info
  nextPayment: string;
  nextPaymentDate: string;
  payoutMethod: string;

  // Chart data
  chartData: { name: string; earnings: number }[];

  // Recent activity
  recentActivity: { type: string; amount: string; time: string; username: string }[];

  // Period
  selectedPeriod: string;
}

export const defaultDashboardConfig: DashboardConfig = {
  displayName: 'Belle Delphine',
  username: '@belledelphine',
  avatarUrl: '',
  verified: true,

  balance: '$12,847.50',
  pendingBalance: '$2,340.00',
  subscribers: '2,341',
  fans: '15,892',
  tips: '$3,420.00',
  messages: '$1,890.00',
  referrals: '$450.00',

  totalEarnings: '$18,607.50',
  subscriptionEarnings: '$12,847.50',
  tipEarnings: '$3,420.00',
  messageEarnings: '$1,890.00',
  referralEarnings: '$450.00',

  nextPayment: '$12,847.50',
  nextPaymentDate: 'March 15',
  payoutMethod: 'Bank Transfer',

  selectedPeriod: '30D',

  chartData: [
    { name: 'Jan', earnings: 4200 },
    { name: 'Feb', earnings: 5800 },
    { name: 'Mar', earnings: 7200 },
    { name: 'Apr', earnings: 6100 },
    { name: 'May', earnings: 8500 },
    { name: 'Jun', earnings: 9200 },
    { name: 'Jul', earnings: 11400 },
    { name: 'Aug', earnings: 12847 },
  ],

  recentActivity: [
    { type: 'Subscription', amount: '$15.00', time: '2 min ago', username: '@user1234' },
    { type: 'Tip', amount: '$50.00', time: '15 min ago', username: '@bigfan99' },
    { type: 'Tip', amount: '$25.00', time: '32 min ago', username: '@supporter' },
    { type: 'Message', amount: '$5.00', time: '1 hour ago', username: '@viewer22' },
    { type: 'Subscription', amount: '$15.00', time: '2 hours ago', username: '@newfan' },
    { type: 'Tip', amount: '$100.00', time: '3 hours ago', username: '@whale42' },
    { type: 'Message', amount: '$10.00', time: '5 hours ago', username: '@chatter' },
  ],
};
