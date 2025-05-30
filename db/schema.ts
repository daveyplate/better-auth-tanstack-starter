import {
  pgTable,
  text,
  timestamp,
  foreignKey,
  boolean,
  unique,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const verificationToken = pgTable("verificationToken", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ mode: "string" }).notNull(),
  createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
});

export const account = pgTable(
  "account",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    accessToken: text(),
    refreshToken: text(),
    accessTokenExpiresAt: timestamp({ mode: "string" }),
    refreshTokenExpiresAt: timestamp({ mode: "string" }),
    scope: text(),
    idToken: text(),
    password: text(),
    createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [appUsers.id],
      name: "account_userId_app_users_id_fk",
    }),
  ]
);

export const session = pgTable(
  "session",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    token: text().notNull(),
    expiresAt: timestamp({ mode: "string" }).notNull(),
    ipAddress: text(),
    userAgent: text(),
    createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [appUsers.id],
      name: "session_userId_app_users_id_fk",
    }),
  ]
);

export const appUsers = pgTable("app_users", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text(),
  email: text().notNull(),
  emailVerified: boolean(),
  image: text(),
  createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
});

export const roles = pgTable(
  "roles",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("roles_name_unique").on(table.name)]
);

export const companies = pgTable("companies", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  parentCompanyId: uuid("parent_company_id"),
});

export const companyOnboardingRequests = pgTable(
  "company_onboarding_requests",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    companyName: text("company_name").notNull(),
    contactName: text("contact_name").notNull(),
    email: text().notNull(),
    mobileNumber: text("mobile_number"),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    isEnrolled: boolean("is_enrolled").default(false).notNull(),
  }
);

export const userCompanyRoles = pgTable(
  "user_company_roles",
  {
    userId: uuid("user_id").notNull(),
    companyId: uuid("company_id").notNull(),
    roleId: uuid("role_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [companies.id],
      name: "user_company_roles_company_id_companies_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [roles.id],
      name: "user_company_roles_role_id_roles_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [appUsers.id],
      name: "user_company_roles_user_id_app_users_id_fk",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.userId, table.companyId, table.roleId],
      name: "user_company_roles_user_id_company_id_role_id_pk",
    }),
  ]
);
