
export enum TaskStatus {
  AVAILABLE = 'AVAILABLE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED'
}

export type UserRole = 'USER' | 'ADMIN' | 'SUPPORT';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  balance: number;
  avatar?: string;
  phoneNumber?: string;
  telegramHandle?: string;
  is2FA?: boolean;
  joinDate: string;
  totalTaskDone: number;
  warnings?: number;
  isBanned?: boolean;
  banReason?: string;
  banUntil?: string; 
}

export interface UserStats {
  balance: number;
  totalClicks: number;
  totalEarnings: number;
  referralCount: number;
  referralClicks: number;
  referralRegistrations: number;
  conversionRate: number;
  pendingCommission: number;
  withdrawnCommission: number;
  taskEarnings: number;
}

export interface SystemStats {
  totalTasksDone: number;
  totalSystemBalance: number;
  activeTasks: number;
  totalUsers: number;
}

export type TransactionType = 'DEPOSIT' | 'WITHDRAW' | 'REDEEM_CARD';
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'CANCELLED' | 'REPORTED' | 'EXPIRED';

export interface PaymentTransaction {
  id: string;
  userId: string;
  userName: string;
  type: TransactionType;
  amount: number;
  method: string;
  details: string; 
  content: string; 
  status: TransactionStatus;
  timestamp: string;
  contactInfo?: string; // Gmail hoặc Telegram để nhận mã thẻ
  expiresAt?: string; 
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  transactionId?: string;
  subject: string;
  message: string;
  billImage?: string;
  status: 'OPEN' | 'RESOLVED' | 'CLOSED';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  text: string;
  timestamp: string;
  type: 'SYSTEM' | 'TEXT' | 'IMAGE' | 'FILE';
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
}

export type ProductType = 'GAME' | 'GOODS';
export type GameCategory = 'ACC' | 'REG' | 'AIM' | 'BUFF' | 'DATA' | 'HACK' | 'MODSKIN' | 'NONE';

export interface MarketProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  tag: string;
  seller: string;
  type: ProductType;
  gameCategory?: GameCategory;
  externalUrl?: string;
}

export type SpecialTaskType = 'REV_APP' | 'REV_MAP' | 'TIM_MAP' | 'TAI_APP' | 'REV_TRIP';

export interface Task {
  id: string;
  title: string;
  reward: number;
  commission: number;
  source: string;
  apiKey?: string;
  autoCredit: boolean;
  isSpecial: boolean;
  specialType?: SpecialTaskType;
  targetUrl?: string;
  category: string;
  time: string;
  limit: number;
  done: number;
}
