import { createFileRoute, Link } from "@tanstack/react-router";
import {
  listCompanyOnboardingRequests,
  SelectCompanyOnboardingRequest,
} from "@/app/server-actions/onboarding";

export const Route = createFileRoute("/admin/onboarding-requests/")({
  loader: async () => {
    const requests = await listCompanyOnboardingRequests();
    return { requests };
  },
  component: OnboardingRequestsPage,
});

function OnboardingRequestsPage() {
  const { requests } = Route.useLoaderData();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Company Onboarding Requests</h1>
      <ul>
        {requests.map((request: SelectCompanyOnboardingRequest) => (
          <li
            key={request.id}
            className={`border p-2 mb-2 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors ${
              request.isEnrolled ? "border-green-500" : "border-red-500"
            }`}
          >
            <Link
              to="/admin/onboarding-requests/$requestId"
              params={{ requestId: request.id }}
              className="flex-1 flex items-center gap-4 no-underline text-inherit"
            >
              <span className="font-medium">{request.companyName}</span>
              <span
                className={
                  request.isEnrolled ? "text-green-600" : "text-red-600"
                }
              >
                {request.isEnrolled ? "Enrolled" : "Not Yet Enrolled"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
