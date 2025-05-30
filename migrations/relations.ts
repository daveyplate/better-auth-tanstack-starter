import { relations } from "drizzle-orm/relations";
import {
  appUsers,
  account,
  session,
  companies,
  userCompanyRoles,
  roles,
} from "../db/schema";

export const accountRelations = relations(account, ({ one }) => ({
  appUser: one(appUsers, {
    fields: [account.userId],
    references: [appUsers.id],
  }),
}));

export const appUsersRelations = relations(appUsers, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
  userCompanyRoles: many(userCompanyRoles),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  appUser: one(appUsers, {
    fields: [session.userId],
    references: [appUsers.id],
  }),
}));

export const userCompanyRolesRelations = relations(
  userCompanyRoles,
  ({ one }) => ({
    company: one(companies, {
      fields: [userCompanyRoles.companyId],
      references: [companies.id],
    }),
    role: one(roles, {
      fields: [userCompanyRoles.roleId],
      references: [roles.id],
    }),
    appUser: one(appUsers, {
      fields: [userCompanyRoles.userId],
      references: [appUsers.id],
    }),
  })
);

export const companiesRelations = relations(companies, ({ many }) => ({
  userCompanyRoles: many(userCompanyRoles),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userCompanyRoles: many(userCompanyRoles),
}));
