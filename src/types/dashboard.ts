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

  // Chart data
  chartData: { name: string; earnings: number }[];

  // Recent activity
  recentActivity: { type: string; amount: string; time: string }[];
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
    { type: 'Subscription', amount: '$15.00', time: '2 min ago' },
    { type: 'Tip', amount: '$50.00', time: '15 min ago' },
    { type: 'Tip', amount: '$25.00', time: '32 min ago' },
    { type: 'Message', amount: '$5.00', time: '1 hour ago' },
    { type: 'Subscription', amount: '$15.00', time: '2 hours ago' },
  ],
};
