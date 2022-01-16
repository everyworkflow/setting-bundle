/*
 * @copyright EveryWorkflow. All rights reserved.
 */

import { lazy } from "react";

const SettingPage = lazy(() => import("@EveryWorkflow/SettingBundle/Admin/Page/SettingPage"));

export const SettingRoutes = [
    {
        path: '/setting',
        component: SettingPage
    },
    {
        path: '/setting/:code',
        component: SettingPage
    },
];
