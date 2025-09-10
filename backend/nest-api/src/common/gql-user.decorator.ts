import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../users/user.entity';

export interface GqlContext {
  req: RequestWithUser;
}
interface RequestWithUser extends Request {
  user: User;
}
export const GqlUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext<GqlContext>();
    return gqlContext.req.user;
  },
);
