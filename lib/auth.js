import redirect from "./redirect";
import { setCookie, getCookie, removeCookie } from "./session";
//import { authenticate } from "../services/authApi";
import { createUser } from "../services/userApi";
import getConfig from 'next/config';
const {publicRuntimeConfig} = getConfig();

export const getChallenge = async (account) => {
    const res = await fetch(
        `${publicRuntimeConfig.API_URI}/auth/${account.toLowerCase()}`
    );
    return await res.json();
};

export const verifySignature = async ({ challenge, signature, account }) => {
    const res = await fetch(
        `${publicRuntimeConfig.API_URI}/auth/${challenge[1].value}/${signature}`
    );
    const body = await res.json();

    if (res.status === 200 && body.recovered === account.toLowerCase()) {
        if (!body.jwt) {
            return "no token?";
        }

        setCookie("jwt", body.jwt);
        redirect("/auth/user");
        return null;
    } else {
        return "Signature not verified";
    }
};

export const signUp = async (name, email, password, password_confirmation) => {
    const error = validateNewUser(name, email, password, password_confirmation);
    if (error) {
    return error;
    }

    const res = await createUser(name, email, password, password_confirmation);

    if (!res.data) {
    return res;
    }

    setCookie("success", `${name}, your account was created.`);
    redirect("/auth/login");
    return null;
};

export const signOut = (ctx = {}) => {
    if (process.browser) {
        removeCookie("jwt");
        redirect("/", ctx);
    }
};

export const getJwt = ctx => {
    return getCookie("jwt", ctx.req);
};

export const isAuthenticated = ctx => !!getJwt(ctx);

export const redirectIfAuthenticated = ctx => {
    if (isAuthenticated(ctx)) {
    redirect("/", ctx);
    return true;
    }
    return false;
};

export const redirectIfNotAuthenticated = ctx => {
    if (!isAuthenticated(ctx)) {
    redirect("/auth/login", ctx);
    return true;
    }
    return false;
};
