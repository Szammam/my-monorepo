export type UUID = string;
export type IsoDateTime = string;
export type IsoDate = string;

export type Role = 'ADMIN' | 'VENDOR' | 'COURIER' | 'CUSTOMER' | 'OWNER';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'BLOCKED';
export type DevicePlatform = 'ANDROID' | 'IOS' | 'WEB';
export type ClientType = 'PARTNERS' | 'MOBILE' | 'LANDING' | 'ADMIN';
export type VendorStatus = 'PENDING_REVIEW' | 'ACTIVE' | 'PAUSED' | 'SUSPENDED' | 'CLOSED';
export type EmailConfirmation = 'EMAIL_LINK' | 'SMS_OTP';
export type OfferStatus = 'DRAFT' | 'ACTIVE' | 'SOLD_OUT' | 'EXPIRED' | 'CANCELLED';

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface FieldError {
  field: string;
  message: string;
}

/** RFC 9457 Problem JSON returned by the Szammam backend */
export interface ProblemDetail {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  code?: string;
  errors?: Record<string, string>;
  fieldErrors?: FieldError[];
}

export type ApiProblem = ProblemDetail;

/** Mobile and landing: the signed-in customer's own record */
export interface CustomerUser {
  id: UUID;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  phoneVerified: boolean;
  locale: string;
  roles: Role[];
  createdAt: IsoDateTime;
}

/** Partners / admin panel user record */
export interface VendorUser extends CustomerUser {
  lastLoginAt: IsoDateTime | null;
}

export type User = CustomerUser;

/** Auth responses (Web surfaces use httpOnly refresh cookie; Mobile returns refreshToken) */
export interface WebTokenResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  newUser: boolean;
}

export interface MobileTokenResponse extends WebTokenResponse {
  refreshToken: string;
}

export type LoginResponse = WebTokenResponse;

export interface OtpRequest {
  phoneNumber: string;
}

export interface OtpSentResponse {
  expiresAt: IsoDateTime;
}

export interface OtpVerifyRequest {
  phoneNumber: string;
  code: string;
  fullName?: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

/** Food type dictionary entry */
export interface FoodType {
  id: number;
  code: string;
  nameEn: string;
  namePl: string;
  iconKey: string | null;
  sortOrder: number;
}

/** Menu category & items from API contract v1 */
export interface MenuCategory {
  id: UUID;
  name: string;
  sortOrder: number;
  active: boolean;
  createdAt: IsoDateTime;
}

export type Category = MenuCategory;

export interface MenuItem {
  id: UUID;
  categoryId: UUID | null;
  foodType: string | null;
  name: string;
  description: string | null;
  price: number;
  currency: 'PLN';
  vatRate: number;
  imageUrl: string | null;
  allergens: string[];
  available: boolean;
  createdAt: IsoDateTime;
}

export type ProductSummary = Pick<
  MenuItem,
  'id' | 'categoryId' | 'foodType' | 'name' | 'price' | 'currency' | 'imageUrl' | 'available'
>;

export type ProductDetail = MenuItem;
