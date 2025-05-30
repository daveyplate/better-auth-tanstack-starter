import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
// CORRECT IMPORT: Import zodValidator, not parseZodSchema
import { zodValidator } from "@tanstack/zod-form-adapter";
import { toast } from "sonner";
import { submitCompanyOnboardingRequest } from "../server-actions/onboarding"; // Import the server action

// Define your form schema with Zod
const companySignupSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  contactName: z.string().min(1, "Contact Name is required"),
  email: z.string().email("Invalid email address"),
  mobileNumber: z.string(), // required, but can be empty
});

export const Route = createFileRoute("/company-signup")({
  component: CompanySignup,
});

function CompanySignup() {
  const form = useForm({
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      mobileNumber: "",
    },
    validatorAdapter: zodValidator(companySignupSchema),
    onSubmit: async ({ value }) => {
      toast.loading("Submitting your request...");
      try {
        const result = await submitCompanyOnboardingRequest({ data: value });
        if (result.success) {
          toast.success("Onboarding request submitted successfully!", {
            description:
              "We've received your details and will be in touch soon.",
          });
          form.reset();
        } else if (result.error) {
          toast.error("Failed to submit request", {
            description: result.error,
          });
        } else {
          toast.error("Failed to submit request", {
            description: "An unknown error occurred.",
          });
        }
      } catch (error) {
        toast.error("Failed to submit request", {
          description: "An unexpected error occurred. Please try again.",
        });
      }
    },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Company Sign Up Request</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // form.handleSubmit() will internally trigger validation based on validatorAdapter
          // and then call onSubmit if validation passes.
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {/* Company Name Field */}
        <form.Field name="companyName">
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
              {field.state.meta.errors ? (
                <em className="text-red-600 text-sm">
                  {field.state.meta.errors.join(", ")}
                </em>
              ) : null}
            </div>
          )}
        </form.Field>

        {/* Contact Name Field */}
        <form.Field name="contactName">
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                Contact Name
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
              {field.state.meta.errors ? (
                <em className="text-red-600 text-sm">
                  {field.state.meta.errors.join(", ")}
                </em>
              ) : null}
            </div>
          )}
        </form.Field>

        {/* Email Field */}
        <form.Field name="email">
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
              {field.state.meta.errors ? (
                <em className="text-red-600 text-sm">
                  {field.state.meta.errors.join(", ")}
                </em>
              ) : null}
            </div>
          )}
        </form.Field>

        {/* Mobile Number Field */}
        <form.Field name="mobileNumber">
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number (Optional)
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {field.state.meta.errors ? (
                <em className="text-red-600 text-sm">
                  {field.state.meta.errors.join(", ")}
                </em>
              ) : null}
            </div>
          )}
        </form.Field>

        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={form.state.isSubmitting} // Disable button while submitting
        >
          {form.state.isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
