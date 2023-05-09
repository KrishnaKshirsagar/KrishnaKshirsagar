import { DashboardPermission } from "../interfaces/constants/dashboardPermission";

export const dashboardPermissions: Record<
  DashboardPermission,
  DashboardPermission
> = {
  // Dashboard Actions
  PRINT_DASHBOARD: "PRINT_DASHBOARD",
  DOWNLOAD_DASHBOARD_DATA: "DOWNLOAD_DASHBOARD_DATA",
};

export default dashboardPermissions;
