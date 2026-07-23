import React, { useState } from 'react'

// Native datetime-local input wired the same way BASE's DateField wires into
// config[...] items (item.data.value + state.modified), since DateField itself
// only supports date-only pickers and this app has no datetime-range widget.
export function DateTimeField({ item, className }) {
    const [, setTick] = useState(0)
    const state = item.schema.dataSourceController.state

    function handleChange(event) {
        item.data.value = event.target.value
        state.modified = true
        setTick(t => t + 1)
    }

    function setValue(value) {
        item.data.value = value
        setTick(t => t + 1)
    }

    item.setValue = setValue

    return (
        <input
            type="datetime-local"
            id={item.schema.name}
            name={item.schema.name}
            className={className}
            value={item.data.value || ''}
            onChange={handleChange}
        />
    )
}

// "yyyy-MM-dd HH:mm:ss" (Laravel) <-> "yyyy-MM-ddTHH:mm" (datetime-local input)
export function toDateTimeLocal(value) {
    if (!value) return ''
    return String(value).replace(' ', 'T').substring(0, 16)
}

export function fromDateTimeLocal(value) {
    if (!value) return null
    return String(value).replace('T', ' ') + (value.length === 16 ? ':00' : '')
}
