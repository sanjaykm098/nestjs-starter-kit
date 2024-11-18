import { JwtModule } from '@nestjs/jwt';

const JwtUpdated = JwtModule.register({
  secret: 'secretKey',
  signOptions: {
    expiresIn: 36000,
  },
});

export default JwtUpdated;
