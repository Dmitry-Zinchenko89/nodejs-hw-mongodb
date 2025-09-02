import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../model/user.js'
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { Session } from '../model/session.js';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';


export const registerUser = async (payload) => {
    const user = await User.findOne({
        email: payload.email
    });
    if (user) throw createHttpError(409, 'Email in use');

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    return await User.create({
        ...payload,
        password: encryptedPassword,
    });
};

export const loginUser = async (payload) => {
    const user = await User.findOne({ email: payload.email });

    if (!user) {
        throw createHttpError(401, 'User not found');
    }
    const isEqual = await bcrypt.compare(payload.password, user.password);

    if (!isEqual) {
        throw createHttpError(401, 'Unauthorized');
    }

    await Session.deleteOne({ userId: user._id });

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return await Session.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    });
};

export const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
    const session = await Session.findOne({
        _id: sessionId,
        refreshToken,
    });

    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);
    if (isSessionTokenExpired) {
        throw createHttpError(401, 'Session token expired');
    }

    const newSession = createSession();

    await Session.deleteOne({ _id: sessionId, refreshToken });

    return await Session.create({
        userId: session.userId,
        ...newSession,
    });
};

export const logoutUser = async (sessionId) => {
    await Session.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const JWT_SECRET = getEnvVar('JWT_SECRET');
    const APP_DOMAIN = getEnvVar('APP_DOMAIN');

    const token = jwt.sign(
        { email: user.email },
        JWT_SECRET,
        { expiresIn: '5m' }
    );

    const resetUrl = `${APP_DOMAIN}/reset-password?token=${encodeURIComponent(token)}`;

    try {
        await sendEmail({
            from: getEnvVar('SMTP_FROM'),
            to: user.email,
            subject: 'Reset your password',
            html: `
        <p>Hi ${user.name || ''},</p>
        <p>Click the link below to reset your password (valid for 5 minutes):</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
      `,
        });
    } catch (err) {
        throw createHttpError(500, 'Failed to send the email, please try again later.');
    }
};