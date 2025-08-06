export interface IOtpManagementRepo{
    saveOtp(email: string, otp: string): Promise<void>;
    getOtp(email: string): Promise<string | null>;
}