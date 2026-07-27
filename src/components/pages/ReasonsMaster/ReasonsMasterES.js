import { useEffect, useState } from 'react';
import { generateReasonsMasterDisplay } from './ReasonsMasterDS';
import config from './ReasonsMasterCS';
import API from '../../../api/API';

const ReasonsMaster = () => {
    const [rendered, setRendered] = useState(true);
    const [loading, setLoading] = useState(true);
    const [reasons, setReasons] = useState([]);
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('REJECT');
    const [saving, setSaving] = useState(false);

    function reRender() {
        setRendered(!rendered);
    }

    config["CONTROL_CENTER"].renderFunction = reRender;

    useEffect(() => {
        loadReasons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadReasons() {
        try {
            setLoading(true);
            const response = await API.get('reason/list');
            setReasons((response.data && response.data.data) || []);
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptErrorMessage("Error", "Failed to load reasons");
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!code.trim() || !description.trim() || saving) {
            return;
        }

        setSaving(true);
        try {
            await API.post('reason/create', {
                code: code.trim(),
                description: description.trim(),
                type,
                active: true
            });
            setCode('');
            setDescription('');
            config["CONTROL_CENTER"].promptBaseMessage("Reason added", "");
            await loadReasons();
        } catch (error) {
            const payload = error.response && error.response.data;
            const message = (payload && payload.message) || "Failed to add reason";
            config["CONTROL_CENTER"].promptWarningMessage(message, "");
        } finally {
            setSaving(false);
        }
    }

    async function handleToggleActive(reason) {
        try {
            if (reason.active) {
                await API.delete(`reason/delete/${reason.id}`);
            } else {
                await API.put(`reason/update/${reason.id}`, {
                    code: reason.code,
                    description: reason.description,
                    type: reason.type,
                    active: true
                });
            }
            await loadReasons();
        } catch (error) {
            const payload = error.response && error.response.data;
            const message = (payload && payload.message) || "Failed to update reason";
            config["CONTROL_CENTER"].promptWarningMessage(message, "");
        }
    }

    return generateReasonsMasterDisplay(
        config,
        { loading, reasons, code, description, type, saving },
        {
            onCodeChange: setCode,
            onDescriptionChange: setDescription,
            onTypeChange: setType,
            onSave: handleSave,
            onToggleActive: handleToggleActive
        }
    );
};

export default ReasonsMaster;
