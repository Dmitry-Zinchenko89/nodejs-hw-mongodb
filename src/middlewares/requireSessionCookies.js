import createHttpError from 'http-errors';
import { Session } from '../model/session.js';

export const requireSessionCookies = async (req, res, next) => {
    try {
        const { sessionId, refreshToken } = req.cookies || {};
        if (!sessionId || !refreshToken) {
            return next(createHttpError(401, 'Missing session cookies'));
        }

        const session = await Session.findById(sessionId);
        if (!session) return next(createHttpError(401, 'Session not found'));
        if (session.refreshToken !== refreshToken)
            return next(createHttpError(401, 'Refresh token mismatch'));

        const isExpired = new Date() > new Date(session.refreshTokenValidUntil);
        if (isExpired) return next(createHttpError(401, 'Refresh token expired'));


        req.session = session;
        return next();
    } catch (err) {
        next(createHttpError(401, 'Invalid session cookies'));
    }
};