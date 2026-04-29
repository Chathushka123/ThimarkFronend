import { useEffect, useMemo, useState } from 'react'
import { generateGrnPendingCompletedDisplay } from './GrnPendingCompletedDS'
import config from './GrnPendingCompletedCS'
import API from '../../../../api/API'

const GrnPendingCompleted = () => {
    const [rows, setRows] = useState([])
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        config['CONTROL_CENTER'].state.new = true
        config['CONTROL_CENTER'].state.modified = false

        if (!config['inputQueryType'].data.value) {
            config['inputQueryType'].setValue('1')
        }
    }, [])

    config['buttonRunReport'].event.onClick = handleRunReport
    config['buttonDownloadCsv'].event.onClick = handleDownloadCsv

    function setButtonsDisabled(value) {
        if (config['buttonRunReport'].setDisabled) config['buttonRunReport'].setDisabled(value)
        if (config['buttonDownloadCsv'].setDisabled) config['buttonDownloadCsv'].setDisabled(value)
    }

    function getQueryType() {
        const qt = String(config['inputQueryType'].data.value || '')
        if (!qt) {
            config['CONTROL_CENTER'].promptWarningMessage('Please select a query type', '')
            return null
        }
        return qt
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
        const queryType = getQueryType()
        if (!queryType) return

        document.getElementById('spinner').style.display = ''
        setLoading(true)
        setError('')
        setButtonsDisabled(true)

        try {
            const response = await API.get('/reports/grn-pending-vs-completed', {
                params: { query_type: queryType }
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
        const queryType = getQueryType()
        if (!queryType) return

        document.getElementById('spinner').style.display = ''
        setButtonsDisabled(true)

        try {
            const response = await API.get('/reports/grn-pending-vs-completed/download', {
                params: { query_type: queryType },
                responseType: 'blob',
            })

            let filename = `grn_pending_vs_completed_q${queryType}.csv`
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

    const columns = useMemo(() => {
        if (!Array.isArray(rows) || rows.length === 0) return []
        return Object.keys(rows[0])
    }, [rows])

    return generateGrnPendingCompletedDisplay(
        config,
        { rows, columns, count, loading, error }
    )
}

export default GrnPendingCompleted
