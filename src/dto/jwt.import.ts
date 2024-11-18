import { JwtModule } from '@nestjs/jwt';

const JwtUpdated = JwtModule.register({
  secret: 'secretKey',
  signOptions: {
    expiresIn: '2m',
  },
});

export default JwtUpdated;
