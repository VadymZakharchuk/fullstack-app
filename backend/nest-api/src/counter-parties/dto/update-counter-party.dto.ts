import { PartialType } from '@nestjs/mapped-types';
import { CreateCounterPartyDto } from './create-counter-party.dto';

export class UpdateCounterPartyDto extends PartialType(CreateCounterPartyDto) {}
