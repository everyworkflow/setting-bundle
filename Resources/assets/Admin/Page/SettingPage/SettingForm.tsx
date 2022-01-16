/*
 * @copyright EveryWorkflow. All rights reserved.
 */

import React, { useEffect, useState } from 'react';
import Form from 'antd/lib/form';
import Remote from "@EveryWorkflow/PanelBundle/Service/Remote";
import PageHeaderComponent from "@EveryWorkflow/AdminPanelBundle/Component/PageHeaderComponent";
import DataFormComponent from "@EveryWorkflow/DataFormBundle/Component/DataFormComponent";
import AlertAction, { ALERT_TYPE_ERROR, ALERT_TYPE_SUCCESS } from "@EveryWorkflow/PanelBundle/Action/AlertAction";
import { FORM_TYPE_HORIZONTAL } from "@EveryWorkflow/DataFormBundle/Component/DataFormComponent/DataFormComponent";
import { useParams } from 'react-router';
import HttpError from '@EveryWorkflow/PanelBundle/Error/HttpError';
import Error404Component from '@EveryWorkflow/PanelBundle/Component/Error404Component';
import ValidationError from '@EveryWorkflow/PanelBundle/Error/ValidationError';

const SettingForm = () => {
    const [form] = Form.useForm();
    const [remoteStatus, setRemoteStatus] = useState<number | undefined>();
    const [formErrors, setFormErrors] = useState<any>();
    const [remoteData, setRemoteData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const { code = 'general-setting' }: any = useParams();

    useEffect(() => {
        const handleResponse = (response: any) => {
            form.resetFields();
            setRemoteData(response);
            setLoading(false);
        };

        (async () => {
            try {
                setLoading(true);
                const response: any = await Remote.get('/setting/' + code);
                handleResponse(response);
                setRemoteStatus(200);
            } catch (error: any) {
                if (error instanceof HttpError) {
                    setRemoteStatus(error.status);
                }
                AlertAction({
                    description: error.message,
                    message: 'Fetch error',
                    type: ALERT_TYPE_ERROR,
                });
                setLoading(false);
            }
        })();
    }, [code]);

    const onSubmit = async (data: any) => {
        const submitData: any = {};
        Object.keys(data).forEach(name => {
            if (data[name] !== undefined) {
                submitData[name] = data[name];
            }
        });

        const handlePostResponse = (response: any) => {
            AlertAction({
                description: response.detail,
                message: 'Form submit success',
                type: ALERT_TYPE_SUCCESS,
            });
        };

        try {
            const response = await Remote.post('/setting/' + code, submitData);
            handlePostResponse(response);
        } catch (error: any) {
            if (error instanceof ValidationError) {
                setFormErrors(error.errors);
            }

            AlertAction({
                description: error.detail,
                message: 'Submit error',
                type: ALERT_TYPE_ERROR,
            });
        }
    };

    if (remoteStatus === 404) {
        return (
            <Error404Component />
        )
    }

    return (
        <>
            <PageHeaderComponent
                title={remoteData && remoteData['label'] ? remoteData['label'] : code}
                actions={[
                    {
                        button_label: 'Save changes',
                        button_type: 'primary',
                        onClick: () => {
                            form.submit();
                        },
                    }
                ]}
                style={{ marginBottom: 24 }}
            />
            {(!loading && remoteData) && (
                <DataFormComponent
                    form={form}
                    initialValues={remoteData.item}
                    formErrors={formErrors}
                    formData={remoteData.data_form}
                    formType={FORM_TYPE_HORIZONTAL}
                    onSubmit={onSubmit}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 12 }}
                />
            )}
        </>
    );
};

export default SettingForm;
