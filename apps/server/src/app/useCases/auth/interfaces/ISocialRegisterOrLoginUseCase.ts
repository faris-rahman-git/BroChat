import { ResponseDTO } from '../../../../domain/entity/return/ResponseDTO';
import {  SocialRegisterOrLoginType } from '../../../dtos/auth';

export interface ISocialRegisterOrLoginUseCase {
  execute(user: SocialRegisterOrLoginType): Promise<ResponseDTO>;
}
