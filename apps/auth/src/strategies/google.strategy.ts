import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import Joi from 'joi';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            //   clientID: process.env.GOOGLE_CLIENT_ID,
            //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            GOOGLE_OAUTH_CLIENT_ID: Joi.string().required(),
            GOOGLE_OAUTH_CLIENT_SECRET: Joi.string().required(),
            callbackURL: 'http://localhost:3000/auth/google-redirect',
            scope: ['email', 'profile'],
        });
    }
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken,
            refreshToken,
        };
        done(null, user);
    }
}