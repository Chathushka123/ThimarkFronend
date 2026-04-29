import { useEffect, useMemo, useState } from 'react'
import { generateDailyOutputDisplay } from './DailyOutputDS'
import config from './DailyOutputCS'
import API from '../../../../api/API'

const DailyOutput = () => {
    const [rows, setRows] = useState([])
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [selectedQueryType, setSelectedQueryType] = useState(String(config['inputQueryType'].data.value || '1'))

    const queryType = selectedQueryType
    const isDateRange = queryType === '4'

    useEffect(() => {
        config['CONTROL_CENTER'].state.new = true
        config['CONTROL_CENTER'].state.modified = false

        if (!config['inputQueryType'].data.value) {
            config['inputQueryType'].setValue('1')
        }

        setSelectedQueryType(String(config['inputQueryType'].data.value || '1'))
    }, [])

    config['buttonRunReport'].event.onClick = handleRunReport
    config['buttonDownloadCsv'].event.onClick = handleDownloadCsv
    config['inputQueryType'].event.onChange = handleQueryTypeChange

    function handleQueryTypeChange() {
        const selectedQueryType = String(config['inputQueryType'].data.value || '')
        setSelectedQueryType(selectedQueryType || '1')

        if (selectedQueryType !== '4') {
            if (config['inputFromDate'].setDate) config['inputFromDate'].setDate(null)
            if (config['inputToDate'].setDate) config['inputToDate'].setDate(null)
        }
        setError('')
    }

    function formatDate(date) {
        if (!date) return ''
        const d = new Date(date)
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    function getFilterValues() {
        const currentQueryType = String(config['inputQueryType'].data.value || '')
        const fromDate = config['inputFromDate'].data.value
        const toDate = config['inputToDate'].data.value

        if (!currentQueryType) {
            config['CONTROL_CENTER'].promptWarningMessage('Please select a query type', '')
            return null
        }

        if (currentQueryType === '4') {
            if (!fromDate || !toDate) {
                config['CONTROL_CENTER'].promptWarningMessage('From Date and To Date are required for query type 4', '')
                return null
            }
        }

        return {
            query_type: currentQueryType,
            from_date: currentQueryType === '4' ? formatDate(fromDate) : undefined,
            to_date: currentQueryType === '4' ? formatDate(toDate) : undefined,
        }
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
        const params = getFilterValues()
        if (!params) return

        document.getElementById('spinner').style.display = ''
        setLoading(true)
        setError('')

        try {
            const response = await API.get('/reports/daily-production-summary', { params })

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
            document.getElementById('spinner').style.display = 'none'
        }
    }

    async function handleDownloadCsv() {
        const params = getFilterValues()
        if (!params) return

        document.getElementById('spinner').style.display = ''

        try {
            const response = await API.get('/reports/daily-production-summary/download', {
                params,
                responseType: 'blob',
            })

            const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            const suffix = params.query_type === '4' ? `_${params.from_date}_to_${params.to_date}` : ''
            link.setAttribute('download', `daily_production_summary_q${params.query_type}${suffix}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (err) {
            const msg = extractErrorMessage(err, 'Failed to download CSV')
            setError(msg)
            config['CONTROL_CENTER'].promptWarningMessage(msg, '')
        } finally {
            document.getElementById('spinner').style.display = 'none'
        }
    }

    const columns = useMemo(() => {
        if (!Array.isArray(rows) || rows.length === 0) return []
        return Object.keys(rows[0])
    }, [rows])

    return generateDailyOutputDisplay(
        config,
        {
            rows,
            columns,
            count,
            loading,
            error,
            isDateRange,
        },
        {
            onRunReport: handleRunReport,
            onDownloadCsv: handleDownloadCsv,
        }
    )
}

export default DailyOutput
