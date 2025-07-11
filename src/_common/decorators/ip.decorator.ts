import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IpDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const ip = request?.headers['x-forwarded-for'];
    return ip;
  },
);
