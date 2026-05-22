import { useEffect, useState } from 'react'
import { generateGrnPendingCompletedDisplay } from './GrnPendingCompletedDS'
import config from './GrnPendingCompletedCS'
import API from '../../../../api/API'

const GrnPendingCompleted = () => {
    const [rows, setRows] = useState([])
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [fromDate, setFromDate] = useState(() => {
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
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

    async function handleRunReport() {
        if (!fromDate || !toDate) {
            config['CONTROL_CENTER'].promptWarningMessage('Please select both From Date and To Date', '')
            return
        }

        document.getElementById('spinner').style.display = ''
        setLoading(true)
        setError('')
        setButtonsDisabled(true)

        try {
            const response = await API.get('/reports/grn-report', {
                params: { from_date: fromDate, to_date: toDate }
            })

            const payload = response?.data || {}
            const reportRows = Array.isArray(payload?.data)
                ? payload.data
                : Array.isArray(payload)
                    ? payload
                    : []

            const reportCount = typeof payload?.count === 'number'
                ? payload.count
                : reportRows.length

            setRows(reportRows)
            setCount(reportCount)
        } catch (err) {
            const msg = extractErrorMessage(err, 'Failed to run report')
            setRows([])
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
        if (!fromDate || !toDate) {
            config['CONTROL_CENTER'].promptWarningMessage('Please select both From Date and To Date', '')
            return
        }

        document.getElementById('spinner').style.display = ''
        setButtonsDisabled(true)

        try {
            const response = await API.get('/reports/grn-report/download', {
                params: { from_date: fromDate, to_date: toDate },
                responseType: 'blob',
            })

            let filename = `grn_report_${fromDate}_${toDate}.csv`
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

    const columns = ['Date', 'RMPONO', 'supplier', 'code', 'name', 'unite_price', 'qty', 'grn_status','remarks']

    return generateGrnPendingCompletedDisplay(
        config,
        { rows, columns, count, loading, error, fromDate, toDate, setFromDate, setToDate }
    )
}

export default GrnPendingCompleted
