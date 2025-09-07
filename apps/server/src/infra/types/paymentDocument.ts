import { IUserRefPopulated } from '../../domain/entity/user/CallTypes';

export interface IPaymentDocumentPopulated {
  userId: IUserRefPopulated;
  createdAt: NativeDate;
  exclusiveDetails?: { userShare?: number | null } | null;
}
