/*
 * @copyright EveryWorkflow. All rights reserved.
 */

import React, { useCallback, useEffect, useState } from 'react';
import Remote from "@EveryWorkflow/PanelBundle/Service/Remote";
import AlertAction, { ALERT_TYPE_ERROR } from "@EveryWorkflow/PanelBundle/Action/AlertAction";
import Menu from 'antd/lib/menu';
import SubMenu from 'antd/lib/menu/SubMenu';
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router';
import HtmlRawComponent from '@EveryWorkflow/PanelBundle/Component/HtmlRawComponent';
import { Scrollbars } from 'react-custom-scrollbars';

const SettingSidebar = () => {
    const [menuData, setmenuData] = useState<Array<any>>();
    const { code = 'general-setting' }: any = useParams();

    useEffect(() => {
        const handleResponse = (response: any) => {
            if (response.setting_menu_data) {
                setmenuData(response.setting_menu_data);
            }
        };

        (async () => {
            try {
                const response: any = await Remote.get('/setting/menu');
                handleResponse(response);
            } catch (error: any) {
                AlertAction({
                    description: error.message,
                    message: 'Fetch error',
                    type: ALERT_TYPE_ERROR,
                });
            }
        })();
    }, []);

    const findMenuItemByName = (name: string, items: Array<any>) => {
        let selectedItem: any = undefined;
        items.forEach((item: any) => {
            if (item.name === name) {
                selectedItem = item;
                return selectedItem;
            }
            if (item.children) {
                const newItem = findMenuItemByName(name, item.children);
                if (newItem) {
                    selectedItem = newItem;
                    return selectedItem;
                }
            }
        });
        return selectedItem;
    }

    const findMenuParentNames = (childName: string, items: Array<any>): Array<string> => {
        let selectedNames: Array<string> = [];
        items.forEach((item: any) => {
            if (item.name === childName) {
                selectedNames.push(item.name);
                return selectedNames;
            }
            if (item.children) {
                const newNames = findMenuParentNames(childName, item.children);
                if (Array.isArray(newNames) && newNames.length) {
                    selectedNames = [...newNames, item.name];
                    return selectedNames;
                }
            }
        });
        return selectedNames;
    }

    const getSelectedKeys = useCallback(() => {
        const name = code.toString().replaceAll('-', '.');
        return [name];
    }, [code]);

    const getDefaultOpenKeys = useCallback(() => {
        const name = code.toString().replaceAll('-', '.');
        if (!menuData) {
            return [];
        }

        return findMenuParentNames(name, [...menuData]);
    }, [code, menuData]);

    const renderMenuItem = (item: any) => {
        if (item.children && item.item_type === 'group') {
            return (
                <Menu.ItemGroup
                    key={item.name}
                    title={item.item_label}>
                    {item.children.map(renderMenuItem)}
                </Menu.ItemGroup>
            );
        }
        if (item.children) {
            return (
                <SubMenu
                    key={item.name}
                    title={item.item_label}
                    icon={
                        item.item_icon ? (
                            <HtmlRawComponent
                                content={item.item_icon}
                                style={{ display: 'flex' }} />
                        ) : undefined
                    }>
                    {item.children.map(renderMenuItem)}
                </SubMenu>
            );
        }

        return (
            <Menu.Item key={item.name}
                icon={
                    item.item_icon ? (
                        <HtmlRawComponent
                            content={item.item_icon}
                            style={{ display: 'flex' }} />
                    ) : undefined
                }>
                {item.item_path ? (
                    <NavLink to={item.item_path}>{item.item_label}</NavLink>
                ) : <span>{item.item_label}</span>}
            </Menu.Item>
        );
    }

    return (
        <div className="app-sidebar-panel" style={{ width: 258 }}>
            <Scrollbars autoHide={true} style={{ height: 'calc(100vh - 56px)' }}>
                {menuData && Array.isArray(menuData) && (
                    <Menu
                        style={{ width: 256 }}
                        mode="inline"
                        selectedKeys={getSelectedKeys()}
                        defaultOpenKeys={getDefaultOpenKeys()}>
                        {menuData.map(renderMenuItem)}
                    </Menu>
                )}
            </Scrollbars>
        </div>
    );
};

export default SettingSidebar;
