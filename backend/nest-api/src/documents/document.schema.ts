import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

export type DocumentDocument = HydratedDocument<Document>;

@ObjectType()
@Schema()
export class Document {
  @Field(() => ID)
  id: string;

  @Field()
  @Prop()
  fileName: string;

  @Field()
  @Prop()
  url: string;

  @Field()
  @Prop({ required: true })
  content: string;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
