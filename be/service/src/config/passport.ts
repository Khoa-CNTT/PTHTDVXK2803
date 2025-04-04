import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import dotenv from "dotenv";
import { saveCustomerSer } from "../services/customer.service";
import { globalBookTicketsDB } from "./db";

dotenv.config();

const saveCustomer = async (profile: any, provider: string) => {
  let customer = saveCustomerSer(profile, provider);
  return customer;
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.CALLBACK_URL}/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const customer = await saveCustomer(profile, "google");
        return done(null, customer);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      callbackURL: `${process.env.CALLBACK_URL}/facebook/callback`,
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const customer = await saveCustomerSer(profile, "facebook");
        return done(null, customer);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await globalBookTicketsDB.execute(
      "select * from customer where provider_id = ?",
      [id]
    );
    const customer = (rows as any)[0];
    if (!customer) return done(null, false);
    done(null, customer);
  } catch (error) {
    done(error, null);
  }
});
