/*
 * @copyright EveryWorkflow. All rights reserved.
 */

import React, { useContext, useEffect } from 'react';
import PanelContext from "@EveryWorkflow/PanelBundle/Context/PanelContext";
import { ACTION_SET_PAGE_TITLE } from "@EveryWorkflow/PanelBundle/Reducer/PanelReducer";
import { ACTION_HIDE_FOOTER, ACTION_SHOW_FOOTER } from '@EveryWorkflow/AdminPanelBundle/Reducer/AdminPanelReducer';
import AdminPanelContext from '@EveryWorkflow/AdminPanelBundle/Context/AdminPanelContext';
import SettingSidebar from '@EveryWorkflow/SettingBundle/Admin/Page/SettingPage/SettingSidebar';
import SettingForm from '@EveryWorkflow/SettingBundle/Admin/Page/SettingPage/SettingForm';

const SettingPage = () => {
    const { dispatch: panelDispatch } = useContext(PanelContext);
    const { dispatch: adminPanelDispatch } = useContext(AdminPanelContext);

    useEffect(() => {
        panelDispatch({ type: ACTION_SET_PAGE_TITLE, payload: 'Setting' });
        adminPanelDispatch({ type: ACTION_HIDE_FOOTER });
        return () => {
            adminPanelDispatch({ type: ACTION_SHOW_FOOTER });
        };
    }, [panelDispatch]);

    return (
        <div className="list-page-with-tree-sidebar">
            <SettingSidebar />
            <div style={{ marginLeft: 257 }}>
                <SettingForm />
            </div>
        </div>
    );
};

export default SettingPage;
