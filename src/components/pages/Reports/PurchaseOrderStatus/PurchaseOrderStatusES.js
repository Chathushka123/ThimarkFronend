import { useEffect, useMemo, useState } from 'react'
import { generatePurchaseOrderStatusDisplay } from './PurchaseOrderStatusDS'
import config from './PurchaseOrderStatusCS'
import API from '../../../../api/API'

function getQueryTypeFromUrl() {
    const params = new URLSearchParams(window.location.search || '')
    const qt = params.get('query_type')
    return ['1', '2', '6'].includes(String(qt)) ? String(qt) : '1'
}

function setQueryTypeInUrl(queryType) {
    const url = new URL(window.location.href)
    url.searchParams.set('query_type', queryType)
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
}

function parseFilenameFromDisposition(disposition, fallback) {
    if (!disposition) return fallback

    const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i)
    if (utf8Match && utf8Match[1]) return decodeURIComponent(utf8Match[1].trim())

    const asciiMatch = disposition.match(/filename[^;=\n]*=["']?([^"';\n]+)["']?/)
    if (asciiMatch && asciiMatch[1]) return asciiMatch[1].trim()

    return fallback
}

const PurchaseOrderStatus = () => {
    const [rows, setRows] = useState([])
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        config['CONTROL_CENTER'].state.new = true
        config['CONTROL_CENTER'].state.modified = false

        const initialQueryType = getQueryTypeFromUrl()
        config['inputQueryType'].setValue(initialQueryType)
        setQueryTypeInUrl(initialQueryType)
    }, [])

    config['buttonRunReport'].event.onClick = handleRunReport
    config['buttonDownloadCsv'].event.onClick = handleDownloadCsv
    config['inputQueryType'].event.onChange = handleQueryTypeChange

    function handleQueryTypeChange() {
        const qt = String(config['inputQueryType'].data.value || '1')
        setQueryTypeInUrl(qt)
        setError('')
    }

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
            if (typeof payload?.message === 'string' && payload.message.trim() !== '') return payload.message
            const firstValidation = payload?.errors && Object.values(payload.errors)[0]
            if (Array.isArray(firstValidation) && firstValidation.length > 0) return String(firstValidation[0])
        }
        if (typeof err?.response?.data?.message === 'string' && err.response.data.message.trim() !== '') {
            return err.response.data.message
        }
        return fallback
    }

    async function handleRunReport() {
        const qt = getQueryType()
        if (!qt) return

        setQueryTypeInUrl(qt)
        document.getElementById('spinner').style.display = ''
        setLoading(true)
        setError('')
        setButtonsDisabled(true)

        try {
            const response = await API.get('/reports/purchase-order-status', {
                params: { query_type: qt }
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
        const qt = getQueryType()
        if (!qt) return

        setQueryTypeInUrl(qt)
        document.getElementById('spinner').style.display = ''
        setButtonsDisabled(true)

        try {
            const response = await API.get('/reports/purchase-order-status/download', {
                params: { query_type: qt },
                responseType: 'blob',
            })

            const fallbackName = `purchase_order_status_q${qt}.csv`
            const filename = parseFilenameFromDisposition(response.headers?.['content-disposition'], fallbackName)

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

    return generatePurchaseOrderStatusDisplay(
        config,
        { rows, columns, count, loading, error }
    )
}

export default PurchaseOrderStatus
