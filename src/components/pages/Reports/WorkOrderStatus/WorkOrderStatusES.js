import { useEffect, useState } from 'react'
import { generateWorkOrderStatusDisplay } from './WorkOrderStatusDS'
import config from './WorkOrderStatusCS'
import API from '../../../../api/API'

const WorkOrderStatus = () => {
    const [rows, setRows] = useState([])
    const [operations, setOperations] = useState([])
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    // Default range: today minus 30 days, through today.
    const [fromDate, setFromDate] = useState(() => {
        const d = new Date()
        d.setDate(d.getDate() - 30)
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    })
    const [toDate, setToDate] = useState(() => {
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    })

    useEffect(() => {
        config['CONTROL_CENTER'].state.new = true
        config['CONTROL_CENTER'].state.modified = false
    }, [])

    config['buttonRunReport'].event.onClick = handleRunReport
    config['buttonDownloadCsv'].event.onClick = handleDownloadCsv

    function setButtonsDisabled(value) {
        if (config['buttonRunReport'].setDisabled) config['buttonRunReport'].setDisabled(value)
        if (config['buttonDownloadCsv'].setDisabled) config['buttonDownloadCsv'].setDisabled(value)
    }

    function getStatus() {
        return String(config['inputStatus'].data.value || '')
    }

    function extractErrorMessage(err, fallback) {
        if (err?.response?.status === 422) {
            const payload = err.response.data
            if (typeof payload?.message === 'string' && payload.message.trim() !== '') {
                return payload.message
            }
            const firstValidation = payload?.errors && Object.values(payload.errors)[0]
            if (Array.isArray(firstValidation) && firstValidation.length > 0) {
                return String(firstValidation[0])
            }
        }
        if (typeof err?.response?.data?.message === 'string' && err.response.data.message.trim() !== '') {
            return err.response.data.message
        }
        return fallback
    }

    function buildParams(status) {
        const params = {}
        if (status) params.status = status
        if (fromDate) params.from_date = fromDate
        if (toDate) params.to_date = toDate
        return params
    }

    async function handleRunReport() {
        const status = getStatus()

        if (fromDate && toDate && fromDate > toDate) {
            config['CONTROL_CENTER'].promptWarningMessage('From Date cannot be after To Date', '')
            return
        }

        document.getElementById('spinner').style.display = ''
        setLoading(true)
        setError('')
        setButtonsDisabled(true)

        try {
            const response = await API.get('/reports/work-order-status', {
                params: buildParams(status)
            })

            const payload = response?.data || {}
            const reportRows = Array.isArray(payload?.data) ? payload.data : []
            const reportOperations = Array.isArray(payload?.operations) ? payload.operations : []
            const reportCount = typeof payload?.count === 'number' ? payload.count : reportRows.length

            setRows(reportRows)
            setOperations(reportOperations)
            setCount(reportCount)
        } catch (err) {
            const msg = extractErrorMessage(err, 'Failed to run report')
            setRows([])
            setOperations([])
            setCount(0)
            setError(msg)
            config['CONTROL_CENTER'].promptWarningMessage(msg, '')
        } finally {
            setLoading(false)
            setButtonsDisabled(false)
            document.getElementById('spinner').style.display = 'none'
        }
    }

    async function handleDownloadCsv() {
        const status = getStatus()

        if (fromDate && toDate && fromDate > toDate) {
            config['CONTROL_CENTER'].promptWarningMessage('From Date cannot be after To Date', '')
            return
        }

        document.getElementById('spinner').style.display = ''
        setButtonsDisabled(true)

        try {
            const response = await API.get('/reports/work-order-status/download', {
                params: buildParams(status),
                responseType: 'blob',
            })

            let filename = 'work_order_status.csv'
            const disposition = response.headers?.['content-disposition']
            if (disposition) {
                const match = disposition.match(/filename[^;=\n]*=["']?([^"';\n]+)["']?/)
                if (match && match[1]) filename = match[1].trim()
            }

            const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (err) {
            const msg = extractErrorMessage(err, 'Failed to download CSV')
            setError(msg)
            config['CONTROL_CENTER'].promptWarningMessage(msg, '')
        } finally {
            setButtonsDisabled(false)
            document.getElementById('spinner').style.display = 'none'
        }
    }

    return generateWorkOrderStatusDisplay(
        config,
        { rows, operations, count, loading, error, fromDate, toDate, setFromDate, setToDate }
    )
}

export default WorkOrderStatus
