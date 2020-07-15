import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import getClaims from '../services/jwt.service';

const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const [, , { req }] = context.getArgs();
  const userData = getClaims(req.headers.authorization);
  return userData.email;
});

export default CurrentUser;
