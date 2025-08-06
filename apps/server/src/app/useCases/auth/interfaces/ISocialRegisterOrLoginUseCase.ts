import { ResponseDTO } from '../../../../domain/dtos/return/ResponseDTO';
import {  SocialRegisterOrLoginType } from '../../../dtos/auth';

export interface ISocialRegisterOrLoginUseCase {
  execute(user: SocialRegisterOrLoginType): Promise<ResponseDTO>;
}
