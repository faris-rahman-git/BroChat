export enum AuthMessages {
  TokenMissing = 'Access token missing',

  CookieNotFound = 'No cookies found',

  AdminOnly = 'Unauthorized: Admin access only',

  TokenInvalid = 'Invalid access token',

  RefrechTokenInvalid = 'Invalid refresh token',

  EmailAlreadyTaken = 'Email Already Taken By Another User',

  InvalidEmail = 'Invalid Email Address',

  MailSendFailed = 'Nodemailer failed to send OTP email',

  InvalidOtp = 'Invalid OTP',

  InvalidEmailOrPassword = 'Invalid Email or Password',

  AccountIsRemoved = 'Account is removed!',

  AccountIsBanned = 'Account is banned!',

  SomthingWentWrong = 'Something went wrong',

  YourAccountWasBanned = 'Your account was banned by admin',

  YourAccountWasDeleted = 'Your account was deleted by admin',
}
