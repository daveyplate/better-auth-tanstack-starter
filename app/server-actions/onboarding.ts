import { db } from "@/db"; // Adjust the import path as needed
import {
  companyOnboardingRequests,
  companies,
  appUsers,
  userCompanyRoles,
  roles,
} from "@/db/schema"; // Adjust the import path as needed and import other tables
import { createServerFn } from "@tanstack/react-start"; // Import createServerFn
import {
  desc,
  type InferSelectModel,
  type InferInsertModel,
  eq,
  sql,
} from "drizzle-orm"; // Import desc, InferSelectModel, InferInsertModel, eq, and sql

// Define the select type for company onboarding requests
export type SelectCompanyOnboardingRequest = InferSelectModel<
  typeof companyOnboardingRequests
>;

// Define the insert type by inferring it from the schema
export type InsertCompanyOnboardingRequest = InferInsertModel<
  typeof companyOnboardingRequests
>;

// Refactor the function to use createServerFn
export const submitCompanyOnboardingRequest = createServerFn({
  method: "POST", // Use POST for form submissions
})
  .validator((data: InsertCompanyOnboardingRequest) => data) // Add a simple validator to type data
  .handler(
    async (
      ctx
    ): Promise<{ success: boolean; message?: string; error?: string }> => {
      const data = ctx.data; // data is now typed correctly

      try {
        // Basic validation
        if (!data.companyName || !data.contactName || !data.email) {
          // Return a consistent error object
          return {
            success: false,
            error: "Company Name, Contact Name, and Email are required.",
          };
        }

        await db.insert(companyOnboardingRequests).values(data);

        // Return a consistent success object
        return {
          success: true,
          message: "Onboarding request submitted successfully.",
        };
      } catch (error) {
        console.error("Error submitting onboarding request:", error);
        // Return a consistent error object for database errors
        return {
          success: false,
          error: `Failed to submit onboarding request: ${error instanceof Error ? error.message : String(error)}`,
        };
      }
    }
  );

// Server function to list company onboarding requests
export const listCompanyOnboardingRequests = createServerFn({
  method: "GET", // Use GET for fetching data
}).handler(async (): Promise<Array<SelectCompanyOnboardingRequest>> => {
  // Use InferSelectModel type
  try {
    const requests = await db
      .select()
      .from(companyOnboardingRequests)
      .orderBy(desc(companyOnboardingRequests.createdAt)); // Order by createdAt descending

    // In a real app, you might want to filter based on user role/permissions here

    // The fetched requests should already conform to SelectCompanyOnboardingRequest type
    return requests;
  } catch (error) {
    console.error("Error listing onboarding requests:", error);
    // Re-throw the error or return an error object as appropriate for your error handling strategy
    throw new Error("Failed to list onboarding requests.");
  }
});

// Server function to get a single company onboarding request by ID
export const getCompanyOnboardingRequest = createServerFn({
  method: "GET", // Use GET for fetching data
})
  .validator((id: string) => id) // Validator to ensure input is a string ID
  .handler(async (ctx): Promise<SelectCompanyOnboardingRequest | undefined> => {
    const requestId = ctx.data; // Access the ID from context

    try {
      const request = await db
        .select()
        .from(companyOnboardingRequests)
        .where(eq(companyOnboardingRequests.id, requestId))
        .limit(1);

      return request[0]; // Return the first result or undefined
    } catch (error) {
      console.error(
        `Error fetching onboarding request with ID ${requestId}:`,
        error
      );
      // Re-throw the error or return an error object
      throw new Error(
        `Failed to fetch onboarding request with ID ${requestId}.`
      );
    }
  });

// Server function to add a company from an onboarding request
export const addCompanyFromOnboardingRequest = createServerFn({
  method: "POST", // Use POST for actions that change data
})
  .validator((requestId: string) => requestId) // Validator for the request ID
  .handler(
    async (
      ctx
    ): Promise<{ success: boolean; message?: string; error?: string }> => {
      const requestId = ctx.data; // Access the request ID from context

      try {
        // Start a transaction
        await db.transaction(async (tx) => {
          // Fetch the onboarding request
          const request = await tx
            .select()
            .from(companyOnboardingRequests)
            .where(eq(companyOnboardingRequests.id, requestId))
            .limit(1);

          const onboardingRequest = request[0];

          if (!onboardingRequest) {
            throw new Error(
              `Onboarding request with ID ${requestId} not found.`
            );
          }

          if (onboardingRequest.isEnrolled) {
            throw new Error(
              "This onboarding request has already been processed."
            );
          }

          // Find or create the user with name and email from the request
          const existingUser = await tx
            .select()
            .from(appUsers)
            .where(eq(appUsers.email, onboardingRequest.email))
            .limit(1);
          let user = existingUser[0];

          if (!user) {
            // Create user with name and email from the request
            const [newUser] = await tx
              .insert(appUsers)
              .values({
                id: sql`gen_random_uuid()`,
                email: onboardingRequest.email,
                name: onboardingRequest.contactName,
              })
              .returning();
            user = newUser;
            if (!user) {
              throw new Error("Failed to create user.");
            }
          } else if (user.name !== onboardingRequest.contactName) {
            // Optionally update the name if it differs
            await tx
              .update(appUsers)
              .set({ name: onboardingRequest.contactName })
              .where(eq(appUsers.id, user.id));
          }

          // Find the 'admin' role
          const adminRole = await tx
            .select()
            .from(roles)
            .where(eq(roles.name, "admin"))
            .limit(1);

          if (!adminRole[0]) {
            throw new Error("'admin' role not found. Please ensure it exists.");
          }
          const adminRoleId = adminRole[0].id;

          // Create the new company
          const [newCompany] = await tx
            .insert(companies)
            .values({
              name: onboardingRequest.companyName,
              // parentCompanyId if applicable
            })
            .returning();

          if (!newCompany) {
            throw new Error("Failed to create company.");
          }

          // Link the user as the admin of the new company
          await tx.insert(userCompanyRoles).values({
            userId: user.id,
            companyId: newCompany.id,
            roleId: adminRoleId,
          });

          // Mark the onboarding request as enrolled
          await tx
            .update(companyOnboardingRequests)
            .set({ isEnrolled: true })
            .where(eq(companyOnboardingRequests.id, requestId));
        });

        // Transaction successful
        return {
          success: true,
          message: "Company added and request marked as enrolled.",
        };
      } catch (error) {
        console.error(
          `Error processing onboarding request ID ${requestId}:`,
          error
        );
        // Return a consistent error object for any transaction errors
        return {
          success: false,
          error: `Failed to add company: ${error instanceof Error ? error.message : String(error)}`,
        };
      }
    }
  );
