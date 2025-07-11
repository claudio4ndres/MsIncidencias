import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ChannelEnum } from '@enums';
import { detectDevice } from '../helpers/detect-device.helper';

export const ChannelDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('headers ', request.headers);
    const channel: ChannelEnum = detectDevice(request.headers);
    return channel;
  },
);
