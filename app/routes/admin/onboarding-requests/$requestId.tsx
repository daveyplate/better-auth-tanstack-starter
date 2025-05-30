import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  getCompanyOnboardingRequest,
  SelectCompanyOnboardingRequest,
  addCompanyFromOnboardingRequest,
} from "@/app/server-actions/onboarding";

export const Route = createFileRoute("/admin/onboarding-requests/$requestId")({
  loader: async ({ params }) => {
    console.log("Loading details for request ID:", params.requestId);
    const request = await getCompanyOnboardingRequest({
      data: params.requestId,
    });
    if (!request) {
      console.error("Onboarding request not found for ID:", params.requestId);
      return { request: null };
    }
    return { request };
  },
  component: OnboardingRequestDetailsPage,
});

function OnboardingRequestDetailsPage() {
  const { request } = Route.useLoaderData();
  const navigate = useNavigate();
  console.log("Request in details page:", request);

  const handleAddCompany = async () => {
    if (!request) return;
    console.log("Calling addCompanyFromOnboardingRequest for ID:", request.id);
    const result = await addCompanyFromOnboardingRequest({ data: request.id });
    if (result.success) {
      alert(result.message || "Company added successfully!");
      navigate({ to: "/admin/onboarding-requests" });
    } else {
      alert(result.error || "Failed to add company.");
    }
  };

  if (!request) {
    return (
      <div className="container mx-auto p-4 text-red-600">
        <p>Onboarding request not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Request Details</h1>
      <div className="border p-4 space-y-2">
        <p>
          <strong>Company Name:</strong> {request.companyName}
        </p>
        <p>
          <strong>Contact Name:</strong> {request.contactName}
        </p>
        <p>
          <strong>Email:</strong> {request.email}
        </p>
        {request.mobileNumber && (
          <p>
            <strong>Mobile Number:</strong> {request.mobileNumber}
          </p>
        )}
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={request.isEnrolled ? "text-green-600" : "text-red-600"}
          >
            {request.isEnrolled ? "Enrolled" : "Not Yet Enrolled"}
          </span>
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(request.createdAt).toISOString()}
        </p>
        <p>
          <strong>Updated At:</strong>{" "}
          {new Date(request.updatedAt).toISOString()}
        </p>
      </div>
      {!request.isEnrolled && (
        <div className="mt-6">
          <button
            onClick={handleAddCompany}
            className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Add Company
          </button>
        </div>
      )}
    </div>
  );
}
