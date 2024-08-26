import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, ResetToken } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ResetTokenRepository extends AbstractRepository<ResetToken> {
  protected readonly logger = new Logger(ResetTokenRepository.name);

  constructor(@InjectModel(ResetToken.name) private readonly resetTokenModel: Model<ResetToken>) {
    super(resetTokenModel);
  }
}