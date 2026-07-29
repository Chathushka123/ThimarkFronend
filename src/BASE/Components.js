import React, { useState, useEffect, useRef } from 'react'
import ReactTooltip from 'react-tooltip';
import FrwkTextBox from "./_TextBox"
import FrwkTbNumberField from "./_TbNumberField"
import FrwkTbIntegerField from "./_TbIntegerField"
import FrwkTbTextBox from "./_TbTextBox"
import FrwkTbLink from "./_TbLink"
import FrwkTextArea from "./_TextArea"
import FrwkButton from './_Button'
import FrwkLabel from './_Label'
import FrwkCheckBox from './_CheckBox'
import FrwkTbCheckBox from './_TbCheckBox'
import FrwkRadio from './_Radio'
import FrwkDropDown from './_DropDown'
import FrwkLovComboBox from './_LovComboBox'
import FrwkLovWindow from './_LovWindow'
import FrwkTbDropDown from './_TbDropDown'
import FrwkGrid from './_Grid'
import FrwkDualStateSelector from './_DualStateSelector'
import FrwkTab from './_Tab'
import FrwkTabPage from './_TabPage'
import FrwkControlCenter from './_ControlCenter'
import FrwkMessenger from './_Messenger'
import DraggableObject, { AlertMessage, PopUPDialog, DropZone } from '../BASE/_Base'
import FrwkMessageListNavigator from './_MessageListNavigator'
import FrwkFileSelector from './_FileSelector'
import FrwkHtmlEditor from './_HtmlEditor'
import FrwkSearchGrid from './_SearchGrid'
import DatePicker from 'react-datepicker'
import FrwkPopUp from './_PopUp'
import FrwkContextMenu from './_ContextMenu'
import 'react-datepicker/dist/react-datepicker.css'
import { data } from 'jquery'

import API from '../api/API';
import Multiselect from 'multiselect-react-dropdown';

import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';



//import { Button, Modal } from 'react-bootstrap';

//import {CheckboxEditor} from "react-data-grid-addon"

// function AlertMessage(props){

// }

import sim0 from "../_images/red-outline-shirt.svg";
import sim1 from "../_images/ornage-outline-shirt.svg";
import sim2 from "../_images/green-outlne-shirt.svg";
import sim3 from "../_images/blue-outline-shirt.svg";
import sim4 from "../_images/red-background-shirt.svg";
import sim5 from "../_images/green-background-shirt.svg";

import pim0 from "../_images/job-card-red.svg";
import pim1 from "../_images/job-card-yellow.svg";
import pim2 from "../_images/job-card-purple.svg";
import pim3 from "../_images/job-card-blue.svg";
import pim4 from "../_images/red-background-shirt.svg";
import pim5 from "../_images/green-background-shirt.svg";

export function MultiSelectDropDownOriginal(props) {
    let [rendered, setRendered] = useState(true);
    let state = props.item.schema.dataSourceController.state;
    let [filteredOptions, setFilteredOptions] = useState(props.item.options);

    useEffect(() => {
        // Update filtered options when props.item.options change
        setFilteredOptions(props.item.options);
    }, [props.item.options]);

    // Function to force re-render
    function reRender() {
        setRendered(!rendered);
    }

    // Function to handle selection
    function onSelect(selectedList, selectedItem) {
        if (selectedItem.id === "select_all") {
            // Select all except "Select All" itself
            props.item.data.value = props.item.options.filter(opt => opt.id !== "select_all");
        } else {
            props.item.data.value = selectedList;
        }

        state.modified = true;
        if (typeof props.item.event.onSelect !== "undefined") {
            props.item.event.onSelect(selectedList, selectedItem);
        }
        if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined") {
            props.item.schema.dataSourceController.renderControlButtons();
        }
        reRender();
    }

    // Function to handle removal
    function onRemove(selectedList, selectedItem) {
        if (selectedItem.id === "select_all") {
            // Deselect all
            props.item.data.value = [];
        } else {
            props.item.data.value = selectedList;
        }

        state.modified = true;
        if (typeof props.item.event.onRemove !== "undefined") {
            props.item.event.onRemove(selectedList, selectedItem);
        }
        if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined") {
            props.item.schema.dataSourceController.renderControlButtons();
        }
        reRender();
    }

    // Function to get selected items
    function getSelectedItems() {
        let d = props.item.data.value.map(data => data.id);
        return d;
    }

    // Function to set options
    function setOptions(list) {
        // Prevent duplicate "Select All" entry
        setFilteredOptions(list);

        // const hasSelectAll = list.some(opt => opt.id === "select_all");
        const hasSelectAll = true;
        props.item.options = hasSelectAll ? list : [{ id: "select_all", name: "Select All" }, ...list];
        reRender();
    }

    // Function to set value
    function setValue(list) {
        props.item.data.value = list;
        // setFilteredOptions(list.length > 0 ? filteredOptions : []);
        reRender();
    }

    async function handleSearch(query) {
        if (!query) {
            setFilteredOptions(props.item.options); // Reset options if query is empty
            return;
        }

        try {

            if (props.item.schema.endpoint) {
                if (props.item.schema.endpoint == "getSizesForDropDown") {
                    setFilteredOptions([])
                    const response = await API.get(`${props.item.schema.endpoint}/${query}`);
                    if (response.status !== 200) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.data;

                    setFilteredOptions(data)
                }
                else {
                    if (query.length >= 1) {
                        setFilteredOptions([])
                        const response = await API.get(`${props.item.schema.endpoint}/${query}`);
                        if (response.status !== 200) {
                            throw new Error('Failed to fetch data');
                        }
                        const data = await response.data;

                        setFilteredOptions(data);
                    }
                }
            }



        } catch (error) {
            console.error("Error searching:", error);
        }
    }

    // Function to select all options
    function selectAll() {
        props.item.data.value = props.item.options.filter(opt => opt.id !== "select_all"); // Exclude "Select All"
        state.modified = true;
        if (typeof props.item.event.onSelect !== "undefined") {
            props.item.event.onSelect(props.item.data.value, { id: "select_all", name: "Select All" });
        }
        if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined") {
            props.item.schema.dataSourceController.renderControlButtons();
        }
        reRender();
    }

    // Function to remove all options
    function removeAll() {
        props.item.data.value = [];
        state.modified = true;
        if (typeof props.item.event.onRemove !== "undefined") {
            props.item.event.onRemove([], { id: "select_all", name: "Select All" });
        }
        if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined") {
            props.item.schema.dataSourceController.renderControlButtons();
        }
        reRender();
    }

    function getSelectedArray() {
        return props.item.data.value;
    }

    // Attach functions to props.item
    props.item.getValue = getSelectedItems;
    props.item.setOptions = setOptions;
    props.item.setValue = setValue;
    props.item.reRender = reRender;
    props.item.selectAll = selectAll; // Add selectAll to props.item
    props.item.removeAll = removeAll; // Add removeAll to props.item
    props.item.handleSearch = handleSearch;
    props.item.getSelectedArray = getSelectedArray;

    const selectedValues = props.item.data.value;

    const getDisplayValue = () => {
        if (selectedValues.length === 0) return "Select options";
        if (selectedValues.length === 1) return selectedValues[0].name;
        return `${selectedValues[0].name}, +${selectedValues.length - 1} more`;
    };

    return (
        <Multiselect
            options={filteredOptions}
            id={props.item.schema.id}
            avoidHighlightFirstOption={props.item.schema.avoidHighlightFirstOption}
            showCheckbox={props.item.schema.showCheckbox}
            disable={props.item.schema.disable}
            onSearch={handleSearch}
            loading={props.item.schema.loading}
            style={props.item.schema.style}
            selectionLimit={props.item.schema.selectionLimit}
            onSelect={onSelect}
            onRemove={onRemove}
            displayValue="name"
            selectedValues={selectedValues}
            placeholder={getDisplayValue()}
            hideSelectedList={true}
        />
    );
}

export function
    MultiSelectDropDown(props) {
    let [rendered, setRendered] = useState(true);
    let state = props.item.schema.dataSourceController.state;
    let [filteredOptions, setFilteredOptions] = useState(props.item.options);
    // let [selectedValue, setSelectedValue] = useState(props.item.data.value || []);
    let selectedValues = props.item.data.value;

    useEffect(() => {
        // Update filtered options when props.item.options change
        setFilteredOptions(props.item.options);
    }, [props.item.options]);

    // Function to force re-render
    function reRender() {
        setRendered(!rendered);
    }

    // Function to handle selection
    function onSelect(selectedList, selectedItem) {
        if (selectedItem.id === "select_all") {
            // Select all except "Select All" itself
            props.item.data.value = props.item.options.filter(opt => opt.id !== "select_all");
        } else {
            props.item.data.value = selectedList;
        }

        state.modified = true;
        if (typeof props.item.event.onSelect !== "undefined") {
            props.item.event.onSelect(selectedList, selectedItem);
        }
        if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined") {
            props.item.schema.dataSourceController.renderControlButtons();
        }
        reRender();
    }

    // Function to handle removal
    function onRemove(selectedList, selectedItem) {
        if (selectedItem.id === "select_all") {
            // Deselect all
            props.item.data.value = [];
        } else {
            props.item.data.value = selectedList;
        }

        state.modified = true;
        if (typeof props.item.event.onRemove !== "undefined") {
            props.item.event.onRemove(selectedList, selectedItem);
        }
        if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined") {
            props.item.schema.dataSourceController.renderControlButtons();
        }
        reRender();
    }

    // Function to get selected items
    function getSelectedItems() {
        return props.item.data.value.map(data => data.id);
    }

    // Function to set options
    function setOptions(list) {
        // Prevent duplicate "Select All" entry - and skip it entirely for
        // single-select fields, where "select all" doesn't make sense.
        setFilteredOptions(list);
        if (props.item.schema.singleSelect) {
            props.item.options = list.filter(opt => opt.id !== "select_all");
        } else {
            const hasSelectAll = list.some(opt => opt.id === "select_all");
            props.item.options = hasSelectAll ? list : [{ id: "select_all", name: "Select All" }, ...list];
        }
        reRender();
    }

    // Function to set value
    function setValue(list) {
        let option = props.item.options;
        let selectList = list;

        let mergedArray = [...option, ...selectList];
        let uniqueArray = Array.from(new Map(mergedArray.map(item => [item.id, item])).values());
        setFilteredOptions(uniqueArray);


        props.item.data.value = list;
        selectedValues = props.item.data.value;
        // setSelectedValue(props.item.data.value);
        reRender();
    }

    function setValueByID(id) {
        let option = props.item.options;
        let selectList = option.filter(opt => id == opt.id);
        setValue(selectList);
    }

    async function handleSearch(query) {
        if (!query) {
            setFilteredOptions(props.item.options); // Reset options if query is empty
            return;
        }

        try {

            if (props.item.schema.endpoint) {
                if (props.item.schema.endpoint == "getSizesForDropDown") {
                    setFilteredOptions([])
                    const response = await API.get(`${props.item.schema.endpoint}/${query}`);
                    if (response.status !== 200) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.data;

                    setFilteredOptions(data)
                }
                else {
                    if (query.length >= 3) {
                        setFilteredOptions([])
                        const response = await API.get(`${props.item.schema.endpoint}/${query}`);
                        if (response.status !== 200) {
                            throw new Error('Failed to fetch data');
                        }
                        const data = await response.data;

                        setFilteredOptions(data);
                    }
                }
            }



        } catch (error) {
            console.error("Error searching:", error);
        }
    }

    // Function to select all options
    function selectAll() {
        props.item.data.value = props.item.options.filter(opt => opt.id !== "select_all"); // Exclude "Select All"
        state.modified = true;
        if (typeof props.item.event.onSelect !== "undefined") {
            props.item.event.onSelect(props.item.data.value, { id: "select_all", name: "Select All" });
        }
        if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined") {
            props.item.schema.dataSourceController.renderControlButtons();
        }
        reRender();
    }

    // Function to remove all options
    function removeAll() {
        props.item.data.value = [];
        state.modified = true;
        if (typeof props.item.event.onRemove !== "undefined") {
            props.item.event.onRemove([], { id: "select_all", name: "Select All" });
        }
        if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined") {
            props.item.schema.dataSourceController.renderControlButtons();
        }
        reRender();
    }

    function getSelectedArray() {
        return props.item.data.value;
    }

    function setDesabled(desabled) {
        props.item.schema.disable = desabled;
        reRender();
    }

    // Attach functions to props.item
    props.item.getValue = getSelectedItems;
    props.item.setOptions = setOptions;
    props.item.setValue = setValue;
    props.item.setValueByID = setValueByID;
    props.item.reRender = reRender;
    props.item.selectAll = selectAll; // Add selectAll to props.item
    props.item.removeAll = removeAll; // Add removeAll to props.item
    props.item.handleSearch = handleSearch;
    props.item.getSelectedArray = getSelectedArray;
    props.item.setDesabled = setDesabled;



    const getDisplayValue = () => {
        if (selectedValues.length === 0) return "Select options";
        if (selectedValues.length === 1) return selectedValues[0].name;
        return `${selectedValues[0].name}, +${selectedValues.length - 1} more`;
    };

    return (
        <Multiselect
            options={filteredOptions}
            id={props.item.schema.id}
            avoidHighlightFirstOption={props.item.schema.avoidHighlightFirstOption}
            showCheckbox={props.item.schema.showCheckbox}
            disable={props.item.schema.disable}
            onSearch={handleSearch}
            loading={props.item.schema.loading}
            style={props.item.schema.style}
            selectionLimit={props.item.schema.selectionLimit}
            onSelect={onSelect}
            onRemove={onRemove}
            displayValue="name"
            selectedValues={selectedValues}
            placeholder={getDisplayValue()}
            hideSelectedList={true}
        />
    );
}

export function TextBox(props) {
    let [rendered, setRendered] = useState(true)
    let [disabled, setDisabled] = useState(false)
    let [readOnly, setReadOnly] = useState(props.item.schema.readOnly === true)
    let comp
    let state = props.item.schema.dataSourceController.state
    let placeholder = ((state.modified === false && state.populated === false) ? props.item.schema.placeholder : "")
    let style = { ...props.style }
    const forceDisabled = props.disabled === true
    const forceReadOnly = props.readOnly === true
    let itemDisabled = disabled

    if (forceDisabled) {
        itemDisabled = true
    } else if (!disabled) {
        itemDisabled = ((((!state.populated) && (props.item.schema.searchable)) || state.new || state.populated) ? false : true)
    }

    if (typeof props.item.functions === "undefined")
        props.item.functions = {}

    function reRender() {
        setRendered(!rendered)
    }
    function setValue(value) {
        //props.item.functions.setValue(value)
        props.item.data.value = value
        reRender()
    }

    function resetValue() {
        //props.item.functions.setValue(value)
        props.item.data.value = props.item.data.oldValue
        reRender()
    }

    props.item.reRender = reRender
    props.item.setValue = setValue
    props.item.resetValue = resetValue
    props.item.setDisabled = setDisabled
    props.item.setReadOnly = setReadOnly


    if (props.item.data.value !== props.item.data.oldValue)
        style = (state.modified === false) ? (state.deleted === false) ? props.style : { ...props.style, textDecorationLine: "line-through" } : (state.deleted === true) ? { ...props.style, color: "blue", textDecorationLine: "line-through" } : { ...props.style, color: "blue" }
    else
        style = (state.deleted === true) ? { ...props.style, textDecorationLine: "line-through" } : style

    function handleChange(event) {
        state.modified = true
        let { value } = event.target
        //props.item.functions.setValue(value)
        props.item.data.value = value

        if (typeof props.item.event.onChange !== 'undefined') {
            props.item.event.onChange(event)
        }
        if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
            props.item.schema.dataSourceController.renderControlButtons()
        reRender()
    }
    comp = <FrwkTextBox
        id={props.item.schema.name}
        style={style}
        className={props.className}
        name={props.item.schema.name}
        value={props.item.data.value}
        placeholder={placeholder}
        visible={props.item.schema.visible}
        disabled={itemDisabled}
        readOnly={forceReadOnly || readOnly}
        showLabel={props.item.schema.showLabel}
        onChange={handleChange}
        functions={props.item.functions}
        onBlur={props.item.event.onBlur}
        onEnterKey={props.item.event.onEnterKey} />
    return comp
}




export function NumberField(props) {
    let comp
    let state = props.item.schema.dataSourceController.state
    let disabled = ((((!state.populated) && (props.item.schema.searchable)) || state.new || state.populated) ? false : true)
    let placeholder = ((state.modified === false && state.populated === false) ? props.item.schema.placeholder : "")
    let style = { ...props.style }
    let [rendered, setRendered] = useState(true)

    if (typeof props.item.functions === "undefined")
        props.item.functions = {}

    function reRender() {
        setRendered(!rendered)
    }
    function setValue(value) {
        //props.item.functions.setValue(value)
        props.item.data.value = value
        reRender()
    }

    props.item.reRender = reRender
    props.item.setValue = setValue


    if (props.item.data.value !== props.item.data.oldValue)
        style = (state.modified === false) ? (state.deleted === false) ? props.style : { ...props.style, textDecorationLine: "line-through" } : (state.deleted === true) ? { ...props.style, color: "blue", textDecorationLine: "line-through" } : { ...props.style, color: "blue" }
    else
        style = (state.deleted === true) ? { ...props.style, textDecorationLine: "line-through" } : style

    function localStringToNumber(s) {
        return Number(String(s).replace(/[^0-9.-]+/g, ""))
    }

    function isNumber(event) {
        event = (event) ? event : window.event;
        var charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode !== 46) && (charCode !== 45)) {
            event.preventDefault()
        }
        if (isNaN(event.target.value + String.fromCharCode(event.which)) && (charCode !== 45))
            event.preventDefault()
        if ((charCode === 45) && (event.target.value.length !== 0)) {
            event.preventDefault()
        }
    }


    function handleChange(event) {
        state.modified = true
        let { value } = event.target

        props.item.data.value = value
        if (typeof props.item.event.onChange !== 'undefined') {
            props.item.event.onChange(event)
        }
        if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
            props.item.schema.dataSourceController.renderControlButtons()
        reRender()
    }

    function handleBlur(event) {


        if (typeof props.item.event.onBlur !== 'undefined') {
            props.item.event.onBlur(event)
        }
    }

    function handleKeyPress(event) {
        if (typeof props.item.event.onKeyPress !== 'undefined') {
            props.item.event.onKeyPress(event)
        }
        return isNumber(event)
    }

    function handleFocus(event) {
        var value = event.target.value;
        //event.target.value = value ? localStringToNumber(value) : ''
        if (typeof props.item.event.onFocus !== 'undefined') {
            props.item.event.onFocus(event)
        }
    }

    comp = <FrwkTextBox
        id={props.item.schema.name}
        style={style}
        className={props.className}
        name={props.item.schema.name}
        value={props.item.data.value}
        placeholder={placeholder}
        visible={props.item.schema.visible}
        disabled={disabled}
        readOnly={props.item.schema.readOnly}
        showLabel={props.item.schema.showLabel}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyPress={handleKeyPress}
        functions={props.item.functions}
        onBlur={handleBlur}
        onEnterKey={props.item.event.onEnterKey} />
    return comp
}


export function IntegerField(props) {
    let comp
    let state = props.item.schema.dataSourceController.state
    let disabled = ((((!state.populated) && (props.item.schema.searchable)) || state.new || state.populated) ? false : true)
    let placeholder = ((state.modified === false && state.populated === false) ? props.item.schema.placeholder : "")
    let style = { ...props.style }
    let [rendered, setRendered] = useState(true)
    let [lastIntVal, setLastIntVal] = useState(props.item.data.value)

    if (typeof props.item.functions === "undefined")
        props.item.functions = {}

    function reRender() {
        setRendered(!rendered)
    }
    function setValue(value) {
        //props.item.functions.setValue(value)
        props.item.data.value = value
        reRender()
    }

    props.item.reRender = reRender
    props.item.setValue = setValue

    if (props.item.data.value !== props.item.data.oldValue)
        style = (state.modified === false) ? (state.deleted === false) ? props.style : { ...props.style, textDecorationLine: "line-through" } : (state.deleted === true) ? { ...props.style, color: "blue", textDecorationLine: "line-through" } : { ...props.style, color: "blue" }
    else
        style = (state.deleted === true) ? { ...props.style, textDecorationLine: "line-through" } : style

    function localStringToNumber(s) {
        return Number(String(s).replace(/[^0-9.-]+/g, ""))
    }

    function isNumber(event) {
        event = (event) ? event : window.event;
        var charCode = (event.which) ? event.which : event.keyCode;


        if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode !== 45)) {
            event.preventDefault()
        }
        if (isNaN(event.target.value + String.fromCharCode(event.which)) && (charCode !== 45))
            event.preventDefault()
        if ((charCode === 45) && isNaN(event.target.value)) {
            event.preventDefault()
        }
        if (isNaN(event.key))
            event.preventDefault()
    }


    function handleChange(event) {
        state.modified = true
        let { value } = event.target

        props.item.data.value = value
        if (typeof props.item.event.onChange !== 'undefined') {
            props.item.event.onChange(event)
        }
        if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
            props.item.schema.dataSourceController.renderControlButtons()
        reRender()
    }

    function handleBlur(event) {

        if (typeof props.item.event.onBlur !== 'undefined') {
            props.item.event.onBlur(event)
        }
    }

    function handleKeyPress(event) {
        if (typeof props.item.event.onKeyPress !== 'undefined') {
            props.item.event.onKeyPress(event)
        }
        return isNumber(event)
    }

    function handleKeyUp(event) {

        event = (event) ? event : window.event;
        var charCode = (event.which) ? event.which : event.keyCode;
        if (isNaN(event.target.value)) {
            props.item.data.value = lastIntVal
            event.target.value = lastIntVal
        }
        else
            setLastIntVal(event.target.value)
        return true
    }

    function handleFocus(event) {
        if (typeof props.item.event.onFocus !== 'undefined') {
            props.item.event.onFocus(event)
        }
    }

    comp = <FrwkTextBox
        id={props.item.schema.name}
        style={style}
        className={props.className}
        name={props.item.schema.name}
        value={props.item.data.value}
        placeholder={placeholder}
        visible={props.item.schema.visible}
        disabled={disabled}
        readOnly={props.item.schema.readOnly}
        showLabel={props.item.schema.showLabel}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyPress={handleKeyPress}
        onKeyUp={handleKeyUp}
        functions={props.item.functions}
        onBlur={handleBlur}
        onEnterKey={props.item.event.onEnterKey} />
    return comp
}


export function MoneyField(props) {
    let comp
    let state = props.item.schema.dataSourceController.state
    let disabled = ((((!state.populated) && (props.item.schema.searchable)) || state.new || state.populated) ? false : true)
    let placeholder = ((state.modified === false && state.populated === false) ? props.item.schema.placeholder : "")
    let style = { ...props.style }
    let [rendered, setRendered] = useState(true)

    if (typeof props.item.functions === "undefined")
        props.item.functions = {}

    function reRender() {
        setRendered(!rendered)
    }
    function setValue(value) {
        //props.item.functions.setValue(value)
        props.item.data.value = value
        reRender()
    }

    props.item.reRender = reRender
    props.item.setValue = setValue



    if (props.item.data.value !== props.item.data.oldValue)
        style = (state.modified === false) ? (state.deleted === false) ? props.style : { ...props.style, textDecorationLine: "line-through" } : (state.deleted === true) ? { ...props.style, color: "blue", textDecorationLine: "line-through" } : { ...props.style, color: "blue" }
    else
        style = (state.deleted === true) ? { ...props.style, textDecorationLine: "line-through" } : style

    function localStringToNumber(s) {
        return Number(String(s).replace(/[^0-9.-]+/g, ""))
    }

    function isNumber(event) {
        event = (event) ? event : window.event;
        var charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode !== 46)) {
            event.preventDefault()
        }
        if (isNaN(event.target.value + String.fromCharCode(event.which)))
            event.preventDefault()
    }


    function handleChange(event) {
        state.modified = true
        let { value } = event.target
        // var options = {
        //     maximumFractionDigits : 2,
        //     currency              : 'LKR',
        //     style                 : "currency",
        //     currencyDisplay       : "symbol"
        // }
        // value = localStringToNumber(value).toLocaleString(undefined, options)
        // e.target.value = value
        //   ? localStringToNumber(value).toLocaleString(undefined, options)
        //   : ''
        //props.item.functions.setValue(value)
        //alert(value)

        props.item.data.value = value
        if (typeof props.item.event.onChange !== 'undefined') {
            props.item.event.onChange(event)
        }
        if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
            props.item.schema.dataSourceController.renderControlButtons()
        reRender()
    }

    function handleBlur(event) {

        let { value } = event.target

        var options = {
            maximumFractionDigits: 2,
            //currency              : 'LKR',
            style: "decimal",
            minimumFractionDigits: 2
            //currencyDisplay       : "symbol"
        }

        event.target.value = value
            ? localStringToNumber(value).toLocaleString(undefined, options)
            : ''

        if (typeof props.item.event.onBlur !== 'undefined') {
            props.item.event.onBlur(event)
        }
    }

    function handleKeyPress(event) {
        if (typeof props.item.event.onKeyPress !== 'undefined') {
            props.item.event.onKeyPress(event)
        }
        return isNumber(event)
    }

    function handleFocus(event) {
        var value = event.target.value;
        event.target.value = value ? localStringToNumber(value) : ''
        if (typeof props.item.event.onFocus !== 'undefined') {
            props.item.event.onFocus(event)
        }
    }

    comp = <FrwkTextBox
        id={props.item.schema.name}
        style={style}
        className={props.className}
        name={props.item.schema.name}
        value={props.item.data.value}
        placeholder={placeholder}
        visible={props.item.schema.visible}
        disabled={disabled}
        readOnly={props.item.schema.readOnly}
        showLabel={props.item.schema.showLabel}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyPress={handleKeyPress}
        functions={props.item.functions}
        onBlur={handleBlur}
        onEnterKey={props.item.event.onEnterKey} />
    return comp
}

export function LovComboBox(props) {

    let comp
    let item = props.item
    let state = props.item.schema.dataSourceController.state
    let [editable, setEditable] = useState(true)
    let [lovDisable, setLovDisable] = useState()

    let disabled = ((((!state.populated) && (props.item.schema.searchable)) || state.new || state.populated) ? false : true)
    let [rendered, setRendered] = useState(true)

    function reRender() {
        setRendered(!rendered)
    }

    function setOptions(optionList, reset) {
        item.options = optionList
        if (reset) {
            item.data.value = ""
        }
        reRender()
    }

    function setValue(value) {
        item.data.value = value
        reRender()
    }


    function setValueWithId(value, id) {
        item.data.value = value
        item.data.id = id
        // state.modified = true
        // if(typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
        //     props.item.schema.dataSourceController.renderControlButtons()
        reRender()
    }

    function setValueWithId2(value, id) {
        item.data.value = value
        item.data.id = id
        // state.modified = true
        // if(typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
        //     props.item.schema.dataSourceController.renderControlButtons()
        reRender()
    }

    item.reRender = reRender
    item.setOptions = setOptions
    item.setValue = setValue
    item.setValueWithId = setValueWithId
    item.setEditable = setEditable
    item.setLovDisable = setLovDisable
    item.setValueWithId2 = setValueWithId2


    const handleChange = (event) => {

        let { value } = event.target
        props.item.data.value = value
        state.modified = true

        if (typeof props.item.
            event.onChange !== 'undefined') {
            props.item.event.onChange(event)
        }
        if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
            props.item.schema.dataSourceController.renderControlButtons()
        reRender()
    }
    comp = <div><FrwkLovComboBox
        id={item.schema.name}
        style={props.style}
        className={props.className}
        name={item.schema.name}
        value={item.data.value}
        placeholder={item.schema.placeholder}
        visible={item.schema.visible}
        editable={editable}
        lovDisable={lovDisable}
        disabled={disabled}
        options={item.options}
        showLabel={item.schema.showLabel}
        onChange={handleChange}
        onBlur={item.event.onBlur}
        onBlurWithChange={item.event.onBlurWithChange}
        onComboSearch={item.event.onComboSearch}
        reRender={item.reRender} />
        <FrwkLovWindow key={item.schema.name + "LovWindow"} id={item.schema.name + "LovWindow"} item={item} className={props.lovClassName} lovHeaderText={props.lovHeaderText} />
    </div>

    return comp
}

export function PasswordField(props) {
    let comp
    let state = props.item.schema.dataSourceController.state
    let disabled = ((((!state.populated) && (props.item.schema.searchable)) || state.new || state.populated) ? false : true)
    let placeholder = ((state.modified === false && state.populated === false) ? props.item.schema.placeholder : "")
    let style = { ...props.style }
    let [rendered, setRendered] = useState(true)

    if (typeof props.item.functions === "undefined")
        props.item.functions = {}

    function reRender() {
        setRendered(!rendered)
    }

    function setValue(value) {
        props.item.data.value = value
        reRender()
    }

    props.item.reRender = reRender
    props.item.setValue = setValue

    function handleChange(event) {
        state.modified = true
        let { value } = event.target
        //props.item.functions.setValue(value)
        props.item.data.value = value
        if (typeof props.item.event.onChange !== 'undefined') {
            props.item.event.onChange(event)
        }
        reRender()
    }


    comp = <FrwkTextBox
        id={props.item.schema.name}
        type={props.item.schema.type}
        style={style}
        className={props.className}
        name={props.item.schema.name}
        value={props.item.data.value}
        placeholder={placeholder}
        visible={props.item.schema.visible}
        disabled={false}
        readOnly={props.item.schema.readOnly}
        showLabel={props.item.schema.showLabel}
        onChange={handleChange}
        functions={props.item.functions}
        onBlur={props.item.event.onBlur}
        onEnterKey={props.item.event.onEnterKey} />
    return comp
}


export function Button(props) {
    let comp
    let [rendered, setRendered] = useState(true)
    let [disabled, setDisabled] = useState(props.item.schema.disabled)
    let [visible, setVisible] = useState(props.item.schema.visible)

    props.item.setDisabled = setDisabled
    props.item.setVisible = setVisible

    comp = <FrwkButton
        type={props.item.schema.type}
        style={props.style}
        label={props.item.schema.label}
        className={props.className}
        name={props.item.schema.name}
        visible={visible}
        showLabel={props.item.schema.showLabel}
        disabled={disabled}
        readonly={props.item.schema.readonly}
        onClick={props.item.event.onClick} >
        {props.children}
    </FrwkButton>

    return comp
}

export function TextArea(props) {
    let comp

    let [rendered, setRendered] = useState(true)
    let [disabled, setDisabled] = useState(false)
    let [readOnly, setReadOnly] = useState(props.item.schema.readOnly)
    let state = props.item.schema.dataSourceController.state
    let itemDisabled = disabled

    if (!disabled) {
        itemDisabled = ((((!state.populated) && (props.item.schema.searchable)) || state.new || state.populated) ? false : true)
    }

    if (typeof props.item.functions === "undefined")
        props.item.functions = {}

    function reRender() {
        setRendered(!rendered)
    }
    function setValue(value) {
        //props.item.functions.setValue(value)
        props.item.data.value = value

        reRender()
    }


    const handleChange = (event) => {

        let { value } = event.target
        props.item.data.value = value
        state.modified = true

        if (typeof props.item.event.onChange !== 'undefined') {
            props.item.event.onChange(event)
        }
        if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
            props.item.schema.dataSourceController.renderControlButtons()
        reRender()
    }
    props.item.reRender = reRender
    props.item.setValue = setValue
    props.item.setDisabled = setDisabled
    props.item.setReadOnly = setReadOnly

    comp = <FrwkTextArea
        id={props.item.schema.name}
        style={props.style}
        className={props.className}
        name={props.item.schema.name}
        value={props.item.data.value}
        placeholder={props.item.schema.placeholder}
        disabled={disabled}
        readOnly={readOnly}
        visible={props.item.schema.visible}
        showLabel={props.item.schema.showLabel}
        onChange={handleChange}
        onBlur={props.item.event.onBlur} />
    return comp
}


export function Label(props) {
    let comp
    comp = <FrwkLabel id={props.item.schema.id} style={props.style} value={props.item.schema.value} visible={props.item.schema.visible} />
    return comp
}

export function RadioGroup(props) {

    let [rendered, setRendered] = useState(true)


    function reRender() {
        setRendered(!rendered)
        props.children.forEach((child) => {
            if ((typeof child.props.children !== "undefined") && (child.type === "div")) {
                child.props.children.forEach((childTwo) => {
                    if (typeof childTwo.props.item !== "undefined") {
                        if (typeof childTwo.props.item[childTwo.props.itemName] !== "undefined") {
                            if (childTwo.props.item[childTwo.props.itemName].objectType === "Radio") {
                                childTwo.props.item[childTwo.props.itemName].reRender()
                            }
                        }
                    }

                })
            }
            else {
                if (typeof child.props.item !== "undefined") {
                    if (typeof child.props.item[child.props.itemName] !== "undefined") {
                        if (child.props.item[child.props.itemName].objectType === "Radio") {
                            child.props.item[child.props.itemName].reRender()
                        }
                    }
                }
            }
        })
    }

    function setValue(value) {

        props.item.data.value = value
        reRender()
    }

    function setItemDisabled(value) {
        if (typeof props.item.schema === 'undefined')
            props.item.schema = {}
        props.item.schema.disabled = value
        reRender()
    }

    function setItemReadOnly(value) {
        if (typeof props.item.schema === 'undefined')
            props.item.schema = {}
        props.item.schema.readOnly = value
        reRender()
    }

    props.item.reRender = reRender
    props.item.setValue = setValue
    props.item.setDisabled = setItemDisabled
    props.item.setReadOnly = setItemReadOnly

    return props.children

}

export function Radio(props) {
    let comp
    //let checked = true

    let item = props.item
    let [rendered, setRendered] = useState(true)

    let state = props.item.schema.dataSourceController.state

    function reRender() {
        setRendered(!rendered)
    }
    function setValue(value) {
        //alert(props.item.data.value);
        props.item.data.value = value
        props.item.reRender()
    }

    props.item.setValue = setValue

    props.item[props.itemName].reRender = reRender

    const handleChange = (event) => {

        let { value } = event.target
        props.item.data.value = value
        state.modified = true

        if (typeof props.item.event.onChange !== 'undefined') {
            props.item.event.onChange(event)
        }
        if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
            props.item.schema.dataSourceController.renderControlButtons()
        props.item.reRender()
    }
    comp = <FrwkRadio
        id={item[props.itemName].schema.id}
        className={props.className}
        name={item[props.itemName].schema.name}
        value={item[props.itemName].schema.value}
        checked={item.data.value === item[props.itemName].schema.value}
        visible={item[props.itemName].schema.visible}
        disabled={item.schema.disabled}
        readOnly={item.schema.readOnly}
        showLabel={item[props.itemName].schema.showLabel}
        onChange={handleChange} />
    return comp
}

export function DropDown(props) {
    let comp
    let item = props.item
    let state = props.item.schema.dataSourceController.state
    let [rendered, setRendered] = useState(true)
    let [disabled, setDisabled] = useState(false)
    let [readOnly, setReadOnly] = useState(props.item.schema.readOnly)
    let itemDisabled = disabled

    if (!disabled) {
        itemDisabled = ((((!state.populated) && (props.item.schema.searchable)) || state.new || state.populated) ? false : true)
    }

    function reRender() {
        setRendered(!rendered)
    }

    function setOptions(optionList, reset) {
        item.options = optionList
        if (reset) {
            item.data.value = ""
        }
        reRender()
    }

    function setValue(value) {
        item.data.value = value
        reRender()
    }
    item.reRender = reRender
    item.setOptions = setOptions
    item.setValue = setValue
    item.setDisabled = setDisabled
    item.setReadOnly = setReadOnly


    const handleChange = (event) => {

        let { value } = event.target
        props.item.data.value = value
        state.modified = true

        if (typeof props.item.event.onChange !== 'undefined') {
            props.item.event.onChange(event)
        }
        if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
            props.item.schema.dataSourceController.renderControlButtons()
        reRender()
    }

    comp = <FrwkDropDown
        id={item.schema.name}
        key={item.schema.name}
        style={props.style}
        className={props.className}
        name={item.schema.name}
        value={item.data.value}
        placeholder={item.schema.placeholder}
        visible={item.schema.visible}
        disabled={itemDisabled}
        readOnly={readOnly}
        options={item.options}
        showLabel={item.schema.showLabel}
        onChange={handleChange}
        onBlur={item.event.onBlur}
        reRender={item.reRender} />

    return comp
}

export function CheckBox(props) {
    let comp
    let item = props.item
    let [rendered, setRendered] = useState(true)

    let state = props.item.schema.dataSourceController.state
    let [disabled, setDisabled] = useState(false)
    let itemDisabled = disabled

    if (!disabled) {
        itemDisabled = ((((!state.populated) && (props.item.schema.searchable)) || state.new || state.populated) ? false : true)
    }


    function reRender() {
        setRendered(!rendered)
    }
    function setValue(value) {
        props.item.data.value = value
        reRender()
    }

    props.item.reRender = reRender
    props.item.setValue = setValue
    item.setDisabled = setDisabled


    const handleChange = (event) => {
        if (!disabled) {
            let { checked } = event.target
            let state = props.item.schema.dataSourceController.state
            state.modified = true

            checked === true ?
                item.data.value = item.schema.checkedValue :
                item.data.value = item.schema.uncheckedValue

            if (typeof item.event.onChange !== 'undefined') {
                item.event.onChange(event)
            }
            if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
                props.item.schema.dataSourceController.renderControlButtons()
            reRender()
        }
    }

    const handleClick = (event) => {
        if (typeof item.event.onClick !== 'undefined') {
            item.event.onClick(event)
        }
    }
    comp = <FrwkCheckBox
        id={item.schema.name}
        type={item.schema.type}
        style={props.style}
        label={item.schema.label}
        className={props.className}
        name={item.schema.name}
        myValue={((item.data.value === item.schema.checkedValue) ? true : false)}
        checked={((item.data.value === item.schema.checkedValue) ? true : false)}
        placeholder={item.schema.placeholder}
        disabled={itemDisabled}
        visible={item.schema.visible}
        showLabel={item.schema.showLabel}
        onClick={handleClick}
        onChange={handleChange} />

    return comp
}

export function TbIntegerField(props) {

    let comp
    let [value, setValue] = useState(props.value)

    //let state = props.item.schema.dataSourceController.state
    //let disabled = ((((!state.populated) && (props.item.schema.searchable))||state.new||state.populated)?false:true)

    if (typeof props.item.functions === "undefined")
        props.item.functions = {}

    const handleChange = (event, rowId, colId) => {

        let { value } = event.target

        if (typeof props.onChange !== 'undefined') {
            props.onChange(event, rowId, colId)
        }
    }

    comp = <FrwkTbIntegerField
        id={props.id}
        style={props.style}
        styleName={props.styleName}
        className={props.className}
        name={props.name}
        rowId={props.rowId}
        colId={props.colId}
        value={props.value}
        placeholder={props.placeholder}
        visible={props.visible}
        functions={props.item.functions}
        showLabel={props.showLabel}
        onChange={handleChange}
        onKeyPress={props.onKeyPress}
        onKeyUp={props.onKeyUp}
        onBlur={props.onBlur} />

    return comp
}

export function TbNumberField(props) {

    let comp
    let [value, setValue] = useState(props.value)

    //let state = props.item.schema.dataSourceController.state
    //let disabled = ((((!state.populated) && (props.item.schema.searchable))||state.new||state.populated)?false:true)

    if (typeof props.item.functions === "undefined")
        props.item.functions = {}

    const handleChange = (event, rowId, colId) => {

        let { value } = event.target

        if (typeof props.onChange !== 'undefined') {
            props.onChange(event, rowId, colId)
        }
    }

    comp = <FrwkTbNumberField
        id={props.id}
        style={props.style}
        className={props.className}
        name={props.name}
        rowId={props.rowId}
        colId={props.colId}
        styleName={props.styleName}
        value={props.value}
        placeholder={props.placeholder}
        visible={props.visible}
        functions={props.item.functions}
        showLabel={props.showLabel}
        onChange={handleChange}
        onBlur={props.onBlur}
        onEnterKey={props.onEnterKey} />
    return comp
}

export function TbTextBox(props) {

    let comp
    let [value, setValue] = useState(props.value)

    //let state = props.item.schema.dataSourceController.state
    //let disabled = ((((!state.populated) && (props.item.schema.searchable))||state.new||state.populated)?false:true)

    if (typeof props.item.functions === "undefined")
        props.item.functions = {}

    const handleChange = (event, rowId, colId) => {

        let { value } = event.target

        if (typeof props.onChange !== 'undefined') {
            props.onChange(event, rowId, colId)
        }
    }

    comp = <FrwkTbTextBox
        id={props.name}
        style={props.style}
        styleName={props.styleName}
        className={props.className}
        name={props.name}
        rowId={props.rowId}
        colId={props.colId}
        value={props.value}
        placeholder={props.placeholder}
        visible={props.visible}
        functions={props.item.functions}
        showLabel={props.showLabel}
        onChange={handleChange}
        onBlur={props.onBlur}
        onEnterKey={props.onEnterKey} />
    return comp
}


export function TbLink(props) {
    let comp
    let [value, setValue] = useState(props.value)

    //let state = props.item.schema.dataSourceController.state
    //let disabled = ((((!state.populated) && (props.item.schema.searchable))||state.new||state.populated)?false:true)

    if (typeof props.item.functions === "undefined")
        props.item.functions = {}

    const handleClick = (event, rowId, colId) => {

        let { value } = event.target
        if (typeof props.onClick !== 'undefined') {
            props.onClick(event, rowId, colId)
        }
    }

    comp = <FrwkTbLink
        id={props.name}
        style={props.style}
        className={props.className}
        name={props.name}
        rowId={props.rowId}
        colId={props.colId}
        value={props.value}
        placeholder={props.placeholder}
        visible={props.visible}
        functions={props.item.functions}
        showLabel={props.showLabel}
        onClick={handleClick} />
    return comp
}

export function TbCheckBox(props) {
    let comp
    let value = props.value
    let checked = (value === props.item.checkedValue) ? true : false
    let [rendered, setRendered] = useState(true)

    function reRender() {
        setRendered(!rendered)
    }
    function setValue(value) {
        props.item.data.value = value
        reRender()
    }

    function setChecked(checkedValue) {
        let checked = checkedValue

        checked === true ?
            value = ((typeof props.item.checkedValue !== 'undefined') ? props.item.checkedValue : 'Y') :
            value = ((typeof props.item.uncheckedValue !== 'undefined') ? props.item.uncheckedValue : 'N')

        props.item.value = value

        reRender()
    }

    props.item.reRender = reRender
    props.item.setValue = setValue
    props.item.setChecked = setChecked

    const handleChange = (event, rowId, colId) => {

        let checked = event.target.checked

        checked === true ?
            value = ((typeof props.item.checkedValue !== 'undefined') ? props.item.checkedValue : 'Y') :
            value = ((typeof props.item.uncheckedValue !== 'undefined') ? props.item.uncheckedValue : 'N')

        props.item.value = value
        if (typeof props.onChange !== 'undefined') {
            props.onChange(event, rowId, colId)
        }
        reRender()
    }

    comp = <FrwkTbCheckBox
        id={props.name}
        style={props.style}
        className={props.className}
        name={props.name}
        rowId={props.rowId}
        colId={props.colId}
        checked={(value === props.item.checkedValue)}
        disabled={props.disabled}
        value={value}
        placeholder={props.placeholder}
        visible={props.visible}
        showLabel={props.showLabel}
        onChange={handleChange}
        onClick={props.onClick} />

    return comp
}

export function TbDropDown(props) {
    let comp
    let item = props.item
    let [rendered, setRendered] = useState(true)

    function reRender() {
        setRendered(!rendered)
    }

    function setOptions(optionList) {
        item.options = optionList
        item.value = ""
        reRender()
    }
    item.reRender = reRender
    item.setOptions = setOptions

    const handleChange = (event, rowId, colId) => {
        if (typeof props.onChange !== 'undefined') {
            props.onChange(event, rowId, colId)
        }
    }


    comp = <FrwkTbDropDown
        id={item.name}
        key={props.key}
        style={props.style}
        className={props.className}
        name={item.name}
        rowId={props.rowId}
        colId={props.colId}
        value={props.value}
        disabled={props.disabled}
        placeholder={item.placeholder}
        visible={item.visible}
        options={item.options}
        showLabel={item.showLabel}
        onChange={handleChange}
        reRender={item.reRender} />


    return comp
}

export function QuantityModifier(props) {
    let itemArray = props.item.data.quantityList
    let quantityModifier

    let [rendered, setRendered] = useState(true)

    function reRender() {
        setRendered(!rendered)
    }

    function setList(list) {
        props.item.data.quantityList = list
        reRender()
    }

    function getSingleModifier(item, index) {

        const handleQtyClick = (event) => {
            if (typeof props.item.event.onQuantityClick !== 'undefined') {
                props.item.event.onQuantityClick(event, item.id)
            }
        }

        const handleCloseClick = (event) => {
            if (typeof props.item.event.onCloseClick !== 'undefined') {
                props.item.event.onCloseClick(event, item.id)
            }
        }


        return (<div className="container align-self-center">
            <div className="row">
                <div className="btn-group btn-group-lg" role="group">
                    <button type="button" className="btn btn-secondary detail-button btn-2">{item.scanId}</button>
                    <button type="button" className="btn btn-secondary detail-button" onClick={handleQtyClick}>{item.quantity}</button>
                </div>
                <button type="button" className="close detail-close" onClick={handleCloseClick}><i className="fas fa-times"></i></button>
            </div>
            <span className="badge badge-light detail-label">{item.displayText}</span>
        </div>)
    }


    props.item.setList = setList

    quantityModifier = Object.keys(itemArray).map((object) => {
        return getSingleModifier(itemArray[object], object)
    })
    return quantityModifier

}


// export function Grid(props){
//     let item = props.item

//     item.sameData = (typeof item.sameData === 'undefined' ? false : item.sameData)
//     item.sameColumns = (typeof item.sameColumns === 'undefined' ? false : item.sameColumns)
//     return <FrwkGrid controller ={item.controller} columns = {item.columns} data={item.data} sameData={item.sameData} sameColumns={item.sameColumns}/>
// }

export function GridHeader(props) {
    return null //props.children
}
export function GridBody(props) {
    return null// props.children
}

export function Grid(props) {
    let comp
    let item = props.item
    let [rendered, setRendered] = useState(true)

    function reRender() {
        setRendered(!rendered)
        //item.sameColumns = (typeof item.sameColumns === 'undefined' ? false : !item.sameColumns)
    }
    function setColumns(columns) {
        item.resetNewRowController()
        item.columns = columns
        reRender()
    }


    function setRowReadOnly(rowId) {
        let dataList = item.data
        if (rowId < dataList.length) {
            dataList[rowId]["_readonly"] = true
        }
        reRender()
    }

    function setRowEditOnly(rowId) {
        let dataList = item.data
        if (rowId < dataList.length) {
            dataList[rowId]["_readonly"] = false
        }
        reRender()
    }

    function setData(data) {
        item.data = data
        item.oldData = JSON.parse(JSON.stringify(data))
        reRender()
    }

    function addRow(row) {

        let controller = props.item.schema.dataSourceController
        controller.state.modified = true

        if (typeof controller.renderControlButtons !== "undefined")
            controller.renderControlButtons()

        item.data[item.data.length] = {}

        Object.keys(item.columns).forEach((object) => {

            if (item.columns[object].objectType !== "Control")
                item.data[item.data.length - 1][item.columns[object].sqlColumn] = row[item.columns[object].sqlColumn];

        })
        item.data[item.data.length - 1]["_rowstate"] = "NEW"
        reRender()
    }

    function handleRowNew(event) {

        let controller = props.item.schema.dataSourceController
        controller.state.modified = true

        if (typeof controller.renderControlButtons !== "undefined")
            controller.renderControlButtons()

        if (typeof props.item.event.onRowNew !== 'undefined') {
            props.item.event.onRowNew(event)
        }
    }

    function handleRowDelete(event, rowId) {

        let controller = props.item.schema.dataSourceController
        controller.state.modified = true

        if (typeof controller.renderControlButtons !== "undefined")
            controller.renderControlButtons()

        if (typeof props.item.event.onRowDelete !== 'undefined') {
            props.item.event.onRowDelete(event, rowId)
        }
    }

    function handleSelectAll(event, colId) {
        let controller = props.item.schema.dataSourceController
        controller.state.modified = true
        if (typeof controller.renderControlButtons !== "undefined")
            controller.renderControlButtons()
        if (typeof props.item.event.onSelectAllClick !== "undefined") {
            props.item.event.onSelectAllClick(event, colId)
        }
    }

    function handleChange(event, rowId, colId) {

        let controller = props.item.schema.dataSourceController
        controller.state.modified = true

        if (typeof controller.renderControlButtons !== "undefined")
            controller.renderControlButtons()
        if (typeof props.item.event.onChange !== "undefined") {

            props.item.event.onChange(event, rowId, colId)
        }
    }

    function getValue(inputRowId, inputColId) {
        let returnValue
        if (item.data.length > inputRowId) {
            let tempItem = item.data[inputRowId]
            if (typeof tempItem !== 'undefined')
                returnValue = item.data[inputRowId][Object.keys(tempItem)[inputColId]]
        }
        return returnValue
    }

    function getValueWiltColName(inputRowId, inputColName) {
        let returnValue

        if (item.data.length > inputRowId) {
            let tempItem = item.data[inputRowId]
            if (typeof tempItem !== 'undefined')
                returnValue = item.data[inputRowId][item.columns[inputColName].sqlColumn]
        }
        return returnValue
    }

    function setChecked(value, rowId, name) {
        if (item.data.length > rowId) {
            item.data[rowId][item.columns[name].sqlColumn] = (value === true) ? item.columns[name].checkedValue : item.columns[name].uncheckedValue
        }
        reRender()
    }

    function setValue(value, rowId, name) {

        if ((item.data.length > rowId) && (item.columns[name].objectType !== "CheckBox")) {
            item.data[rowId][item.columns[name].sqlColumn] = value
            item.schema.dataSourceController.state.modified = true
            item.schema.dataSourceController.renderControlButtons()
        }
        reRender()
    }

    function resetValue(inputRowId, inputColId) {
        if (item.data.length > inputRowId) {
            let tempItem = item.data[inputRowId]
            if (typeof tempItem !== 'undefined')
                item.data[inputRowId][Object.keys(tempItem)[inputColId]] = item.oldData[inputRowId][Object.keys(tempItem)[inputColId]]
        }
        reRender()
    }

    item.getValue = getValue
    item.getValueWiltColName = getValueWiltColName
    item.resetValue = resetValue
    item.setColumns = setColumns
    item.setData = setData
    item.reRender = reRender
    item.addRow = addRow
    item.setRowReadOnly = setRowReadOnly
    item.setRowEditOnly = setRowEditOnly
    item.setChecked = setChecked
    item.setValue = setValue

    if (typeof props.item !== 'undefined') {
        comp = <FrwkGrid controller={item.controller} item={props.item} defaultRowCount={item.defaultRowCount} className={props.className} columns={item.columns} data={item.data} deleteButton={props.deleteButton} customButton={props.customButton} customButton2={props.customButton2} onRowNew={handleRowNew} onRowDelete={handleRowDelete} isDeleteEnabled={props.item.event.isDeleteEnabled} isDeleteVisible={props.item.event.isDeleteVisible} onRowCustomButton={props.item.event.onRowCustomButton} onRowCustomButton2={props.item.event.onRowCustomButton2} onChangeWithColName={props.item.event.onChangeWithColName} onEnterKey={props.item.event.onEnterKey} onChange={handleChange} onSelectAllClick={handleSelectAll} onBlur={props.item.event.onBlur}>
            {props.children}
        </FrwkGrid>
    }
    return comp
}

export function Grid1(props) {
    let item = props.item
    let comp = <><h1>Grid...</h1></>
    let [rendered, setRendered] = useState(true)

    function reRender() {
        setRendered(!rendered)
        //item.sameColumns = (typeof item.sameColumns === 'undefined' ? false : !item.sameColumns)
    }
    function setColumns(columns) {
        item.columns = columns
        reRender()
    }

    function setData(data) {
        item.data = data
        reRender()
    }

    item.setColumns = setColumns
    item.setData = setData
    item.reRender = reRender

    if (typeof props.item !== 'undefined') {

        item.sameData = (typeof item.sameData === 'undefined' ? false : item.sameData)
        item.sameColumns = (typeof item.sameColumns === 'undefined' ? false : item.sameColumns)
        comp = <FrwkGrid controller={item.controller} className={props.className} columns={item.columns} data={item.data} sameData={item.sameData} sameColumns={item.sameColumns} reRender={rendered} deleteButton={props.deleteButton}>

        </FrwkGrid>

    }
    return comp

}

export function DualStateSelector(props) {
    let [rendered, setRendered] = useState(true)
    let item = props.item

    function reRender() {
        setRendered(!rendered)
    }
    item.reRender = reRender

    const handleChange = (event, checkedList) => {

        if (typeof props.onChange !== 'undefined') {
            props.onChange(event, checkedList)
        }
    }
    return <FrwkDualStateSelector item={props.item} className={props.className} style={props.style} selectableColor={props.selectableColor} nonSelectableColor={props.nonSelectableColor} cardClassName={props.cardClassName} cardStyle={props.cardStyle} onChange={handleChange} />
}

export function Tab(props) {
    return <FrwkTab {...props} />
}

export function TabPage(props) {

    return <FrwkTabPage {...props} id={props.item.schema.id} text={props.item.schema.text} disabled={props.item.schema.disabled} />
}

export function ControlCenter(props) {
    let returnList = <><AlertMessage title={"Title"} message={"This is the message"} functions={props.item}></AlertMessage>

        <FrwkControlCenter {...props}>{props.children}</FrwkControlCenter></>

    return returnList
}

export function AdvanceSearch(props) {
    return <FrwkSearchGrid {...props}>{props.children}</FrwkSearchGrid>
}


export function NewButton(props) {
    let comp
    let dsController = props.item.schema.dataSourceController
    let disabled = dsController.state.new
    let [visible, setVisible] = useState(props.item.schema.visible)

    props.item.setVisible = setVisible


    let handleNew = (event) => {
        if (typeof dsController.event.__onNew !== 'undefined') {
            dsController.event.__onNew(event)
        }
    }
    comp = <FrwkButton
        type={props.item.schema.type}
        style={props.style}
        label={props.item.schema.label}
        className={props.className}
        name={props.item.schema.name}
        visible={visible}
        showLabel={props.item.schema.showLabel}
        disabled={disabled}
        onClick={handleNew} >
        {props.children}
    </FrwkButton>

    return comp
}




export function SaveButton(props) {
    let comp
    let dsController = props.item.schema.dataSourceController
    let disabled = (dsController.state.modified === false && dsController.state.deleted === false && dsController.state.new === false)
    let [rendered, setRendered] = useState(true)
    let [visible, setVisible] = useState(props.item.schema.visible)

    props.item.setVisible = setVisible

    function reRender() {
        setRendered(!rendered)
    }

    dsController.renderSaveButton = reRender

    let handleSave = (event) => {

        if (typeof dsController.event.__onSave !== 'undefined') {
            return dsController.event.__onSave(event)
        }
    }
    comp = <FrwkButton
        type={props.item.schema.type}
        style={props.style}
        label={props.item.schema.label}
        className={props.className}
        name={props.item.schema.name}
        visible={visible}
        showLabel={props.item.schema.showLabel}
        disabled={disabled}
        onClick={handleSave} >
        {props.children}
    </FrwkButton>

    return comp
}


export function PopulateButton(props) {
    let comp
    let dsController = props.item.schema.dataSourceController
    let [visible, setVisible] = useState(props.item.schema.visible)

    props.item.setVisible = setVisible
    //let disabled = (dsController.state.populated === false && dsController.state.modified === false && dsController.state.deleted === false)

    let handlePopulate = (event) => {
        if (typeof dsController.event.__onPopulate !== 'undefined') {
            dsController.event.__onPopulate(event)
        }
    }
    comp = <FrwkButton
        type={props.item.schema.type}
        style={props.style}
        label={props.item.schema.label}
        className={props.className}
        name={props.item.schema.name}
        visible={visible}
        showLabel={props.item.schema.showLabel}
        onClick={handlePopulate} >
        {props.children}
    </FrwkButton>

    return comp
}

export function DeleteButton(props) {
    let comp
    let dsController = props.item.schema.dataSourceController
    let disabled = (dsController.state.populated === false && dsController.state.deleted === false)
    let [rendered, setRendered] = useState(true)
    let [visible, setVisible] = useState(props.item.schema.visible)

    props.item.setVisible = setVisible

    function reRender() {
        setRendered(!rendered)
    }

    dsController.renderDeleteButton = reRender

    let handleDelete = (event) => {
        if (typeof dsController.event.__onDelete !== 'undefined') {
            dsController.event.__onDelete(event)
        }
    }
    comp = <FrwkButton
        type={props.item.schema.type}
        style={props.style}
        label={props.item.schema.label}
        className={props.className}
        name={props.item.schema.name}
        visible={visible}
        showLabel={props.item.schema.showLabel}
        disabled={disabled}
        onClick={handleDelete} >
        {props.children}
    </FrwkButton>

    return comp
}

export function AddRowButton(props) {
    let comp
    let item = props.item

    let handleAddRow = (event) => {
        if (typeof item.event.onAddRow !== 'undefined') {
            item.event.onAddRow(event)
        }
    }
    comp = <FrwkButton
        type="Button"
        style={props.style}
        label="Add Row"
        className={props.className}
        name={props.item.schema.name}
        visible={props.item.schema.visible}
        showLabel={props.item.schema.showLabel}
        disabled={false}
        onClick={handleAddRow} >
        {props.children}
    </FrwkButton>

    return comp
}

export function RefreshButton(props) {
    let comp
    let dsController = props.item.schema.dataSourceController
    let disabled = (dsController.state.modified === false && dsController.state.deleted === false)
    let [rendered, setRendered] = useState(true)

    function reRender() {
        setRendered(!rendered)
    }

    dsController.renderRefreshButton = reRender

    let handleRefresh = (event) => {
        if (typeof dsController.event.__onRefresh !== 'undefined') {
            dsController.event.__onRefresh(event)
        }
    }
    comp = <FrwkButton
        type={props.item.schema.type}
        style={props.style}
        label={props.item.schema.label}
        className={props.className}
        name={props.item.schema.name}
        visible={props.item.schema.visible}
        showLabel={props.item.schema.showLabel}
        disabled={disabled}
        onClick={handleRefresh} >
        {props.children}
    </FrwkButton>

    return comp
}

export function Messenger(props) {
    let [rendered, setRendered] = useState(true)

    function reRender() {
        setRendered(!rendered)
    }
    // let myMessageFormatter
    // let receivedMessageFormatter
    // let childrenProp
    // let messageArray = []

    // function extractFormatters(children) {
    //     // Traverse through all children with pretty functional way :-)
    //     React.Children.map(children, (child) => {

    //       // This is support for non-node elements (eg. pure text), they have no props
    //         if(typeof child.type !== "undefined"){
    //             if (child.type.name==="MyMessageFormatter"){
    //                 myMessageFormatter = child.props.children
    //             }
    //             else if(child.type.name==="ReceivedMessageFormatter"){
    //                 receivedMessageFormatter = child.props.children
    //             }
    //         }
    //         if ((child.props) && (child.props.children)) {
    //             // If current component has additional children, traverse through them as well!
    //             extractFormatters(child.props.children)
    //         }
    //     },
    //     )
    // }

    // function applyChatData(children, message, time, avatar){

    //     // Traverse through all children with pretty functional way :-)
    //     return React.Children.map(children, (child) => {

    //         // This is support for non-node elements (eg. pure text), they have no props
    //         if (!child.props) {
    //             return child
    //         }
    //         if (child.props.children) {
    //             //You have to override also children here
    //             if(typeof child.props.children.type !== "undefined"){
    //                 if (child.props.children.type.name==="ChatMessageText"){
    //                     return React.cloneElement(child, {
    //                         children: message,
    //                     })
    //                 }
    //                 else if(child.props.children.type.name==="ChatMessageTime"){
    //                     return React.cloneElement(child, {
    //                         children: time,
    //                     })
    //                 }
    //             }
    //             return React.cloneElement(child, {
    //             children: applyChatData(child.props.children, message, time, avatar),
    //             })
    //         }

    //         if((child.type) && (child.type.name ==="AvatarImg"))
    //             return <img src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg" alt="user" width={60} className={child.props.className}/>

    //         // Return new component with overridden `onChange` callback
    //         return child
    //       },
    //       )
    // }


    // function renderWrappedChildren(children) {
    //     // Traverse through all children with pretty functional way :-)
    //     return React.Children.map(children, (child) => {
    //         let shouldReturn = true

    //       // This is support for non-node elements (eg. pure text), they have no props
    //       if (!child.props) {
    //         return child
    //       }

    //       if(typeof child.type !== "undefined"){
    //           if (child.type.name==="MessageHistrory"){
    //             shouldReturn = false
    //             return React.cloneElement(child, {
    //                 children: renderWrappedChildren(messageArray),
    //             })
    //           }
    //       }
    //       if(shouldReturn){
    //         if (child.props.children) {
    //             //You have to override also children here
    //             if(typeof child.props.children.type !== "undefined"){
    //                 if (child.props.children.type.name==="ChatMessageText"){
    //                     return React.cloneElement(child, {
    //                         children: "child.props.text",
    //                     })
    //                 }
    //                 else if(child.props.children.type.name==="ChatMessageTime"){
    //                     return React.cloneElement(child, {
    //                         children: "9:12 AM, Today",
    //                     })
    //                 }

    //             }
    //             if(child.props.id==="button-addon2"){
    //                 console.log(child)
    //                 return React.cloneElement(child, {
    //                     children: renderWrappedChildren(child.props.children),
    //                     onClick: alert("This is a test"),
    //                 })
    //             }
    //             return React.cloneElement(child, {
    //             children: renderWrappedChildren(child.props.children),
    //             })
    //         }

    //         // Return new component with overridden `onChange` callback
    //         return child
    //     }
    //      },
    //     )
    //   }

    // extractFormatters(props.children)

    // messageArray[messageArray.length] = applyChatData(myMessageFormatter, "Formatter Test", "9:13 AM, Today", "avatar")
    // messageArray[messageArray.length] = applyChatData(receivedMessageFormatter, "Formatter Test", "9:14 AM, Today", "avatar")
    // messageArray[messageArray.length] = applyChatData(myMessageFormatter, "Formatter Test - BOOM BOOM BOOM!", "9:15 AM, Today", "avatar")

    // childrenProp = renderWrappedChildren(props.children)

    //return childrenProp
    function setChatHistry(chatHistry) {
        props.item.data.chatHistry = chatHistry
        reRender()
    }

    props.item.reRender = reRender
    props.item.setChatHistry = setChatHistry
    props.item.inputTextBox.event.onChange = handleChange


    function handleChange(event) {
        props.item.data.newChatMessage = event.target.value
        if (typeof props.item.event.onChange !== "undefined") {
            props.item.event.onChange(event)
        }
        reRender()
    }
    return <FrwkMessenger {...props} onChange={handleChange} />
}

export function FileSelector(props) {
    function handleChange(event) {
        if (typeof props.item.event.onChange !== "undefined") {
            props.item.event.onChange(event)
        }
    }
    return <FrwkFileSelector {...props} onChange={handleChange} />
}


export function MessageHistrory(props) {
    return props.children
}

export function MessageHeader(props) {
    return props.header
}

export function NotificationBubble(props) {
    return props.children
}

export function MessageTime(props) {

    return <div className={props.className} >{props.time}</div>
}

export function ChatMessageBtton(props) {
    function handleClick(event) {
        if ((props.item) && (props.item.event) && (props.item.event.onClick)) {
            props.item.event.onClick(event)
        }
        props.item.inputTextBox.setValue("")
    }
    return <button id={props.id} className={props.className} onClick={handleClick} >{props.children}</button>
}


export function MyMessageFormatter(props) {
    // function renderWrappedChildren(children) {
    //     // Traverse through all children with pretty functional way :-)
    //     return React.Children.map(children, (child) => {

    //       // This is support for non-node elements (eg. pure text), they have no props
    //       if (!child.props) {
    //         return child
    //       }

    //       // If current component has additional children, traverse through them as well!
    //       if (child.props.children) {
    //         //You have to override also children here
    //         if(typeof child.props.children.type !== "undefined"){
    //             if (child.props.children.type.name==="ChatMessageText"){
    //                 return React.cloneElement(child, {
    //                     children: child.props.text,
    //                 })
    //             }
    //             else if(child.props.children.type.name==="ChatMessageTime"){
    //                 return React.cloneElement(child, {
    //                     children: child.props.time,
    //                 })
    //             }
    //         }
    //         return React.cloneElement(child, {
    //           children: renderWrappedChildren(child.props.children),
    //         })
    //       }

    //       // Return new component with overridden `onChange` callback
    //       return child
    //      },
    //     )
    //   }
    // let childrenProp = renderWrappedChildren(props.children)
    // console.log(childrenProp)

    //return props.children
}


export function ReceivedMessageFormatter(props) {

    // function renderWrappedChildren(children) {
    //     // Traverse through all children with pretty functional way :-)
    //     return React.Children.map(children, (child) => {

    //       // This is support for non-node elements (eg. pure text), they have no props
    //       if (!child.props) {
    //         return child
    //       }

    //       // If current component has additional children, traverse through them as well!
    //       if (child.props.children) {
    //         //You have to override also children here
    //         if(typeof child.props.children.type !== "undefined"){
    //             if (child.props.children.type.name==="ChatMessageText"){
    //                 return React.cloneElement(child, {
    //                     children: child.props.text,
    //                 })
    //             }
    //             else if(child.props.children.type.name==="ChatMessageTime"){
    //                 return React.cloneElement(child, {
    //                     children: child.props.time,
    //                 })
    //             }
    //         }
    //         return React.cloneElement(child, {
    //           children: renderWrappedChildren(child.props.children),
    //         })
    //       }

    //       // Return new component with overridden `onChange` callback
    //       return child
    //      },
    //     )
    //   }
    // let childrenProp = renderWrappedChildren(props.children)
    //return props.children
}

export function AttachmentName(props) {
    let [rendered, setRendered] = useState(true)

    function reRender() {
        setRendered(!rendered)
    }



    let [url, setUrl] = useState(props.url)
    function handleClick() {
        props.functions.showPdf(props.url)
    }

    let item = <><button type="button" className="btn btn-link" data-toggle="modal" data-target="#myModal" onClick={handleClick}>
        {props.attachmentName}
    </button>
        <PDFViewer id="myModal" headerText={props.attachmentName} functions={props.functions} source={props.url} />
    </>
    return item
    return props.attachmentName
}



export function AttachmentCloseBtn(props) {
    function handleClick(event) {
        if (typeof props.onClick !== "undefined") {
            props.onClick(event, props.id)
        }
    }
    let item = <><button type="button" className={props.className} onClick={handleClick}>
        {props.children}
    </button></>
    return item

}

export function Attachment(props) {
    function renderWrappedChildren(children, id, attachmentName, url) {
        return React.Children.map(children, (child) => {

            function handleClick(event, id) {
                if (typeof props.onCloseClick !== "undefined") {
                    props.onCloseClick(event, id)
                }
            }
            // This is support for non-node elements (eg. pure text), they have no props
            if (!child.props) {
                return child
            }
            // If current component has additional children, traverse through them as well!
            if (child.props) {
                //You have to override also children here
                if (typeof child.props.typeName !== "undefined") {
                    if (child.props.typeName === "AttachmentName") {
                        let element = React.cloneElement(child, {
                            functions: {},
                            attachmentName: attachmentName,
                            url: url,
                            children: child.props.children,
                        })
                        return element
                    }
                    if (child.props.typeName === "AttachmentCloseBtn") {
                        let element = React.cloneElement(child, {
                            id: id,
                            children: child.props.children,
                            onClick: handleClick,
                        })
                        return element
                    }
                }
                return React.cloneElement(child, {
                    children: renderWrappedChildren(child.props.children, id, attachmentName, url),
                })
            }

            // Return new component with overridden `onChange` callback
            return child
        },
        )
    }
    let childrenProp = props.item.data.attachmentList.map((item) => {
        return renderWrappedChildren(props.children, item.id, item.attachmentName, item.url)
    })
    return childrenProp
}

export function AttachmentList(props) {

    let [rendered, setRendered] = useState(true)

    function reRender() {
        setRendered(!rendered)
    }

    function setAttachmentList(attachmentList) {
        props.item.data.attachmentList = attachmentList
        reRender()
    }

    props.item.reRender = reRender
    props.item.setAttachmentList = setAttachmentList


    function renderWrappedChildren(children, item) {
        // Traverse through all children with pretty functional way :-)
        return React.Children.map(children, (child) => {

            function onCloseClick(event, id) {
                if (typeof item.event.onCloseClick !== "undefined") {
                    item.event.onCloseClick(event, id)
                }
            }

            // This is support for non-node elements (eg. pure text), they have no props
            if (!child.props) {
                return child
            }

            // If current component has additional children, traverse through them as well!
            if (child.props) {
                //You have to override also children here
                if (typeof child.props.typeName !== "undefined") {
                    if (child.props.typeName === "Attachment") {
                        return React.cloneElement(child, {
                            item: item,
                            children: child.props.children,
                            onCloseClick: onCloseClick,
                        })
                    }
                }
                return React.cloneElement(child, {
                    children: renderWrappedChildren(child.props.children, item),
                })
            }

            // Return child
            return child
        },
        )
    }
    let childrenProp = renderWrappedChildren(props.children, props.item)
    return childrenProp
}

export function AdvanceSearchGrid(props) {
    return null
}

export function AdvanceSearchButton(props) {
    return null
}

export function AvatarList(props) {
    let avatarList, avatarOptionList, optionUl
    let deleteButton, addButton
    let [rendered, setRendered] = useState(true)

    function reRender() {
        setRendered(!rendered)
    }

    function handleAddClick(event) {
        event.preventDefault()
        if ((props.item) && (props.item.event) && (props.item.event.onAddClick)) {
            props.item.event.onAddClick(event)
        }
        //event.nativeEvent
        //reRender()
    }

    function setAvatarList(avatarList) {
        props.item.data.avatarList = avatarList

        reRender()
    }

    props.item.setAvatarList = setAvatarList
    props.item.reRender = reRender


    avatarList = props.item.data.avatarList.map((child) => {
        let className = props.className + " " + child.action.toLowerCase()

        function handleDeleteClick(event) {
            if ((props.item) && (props.item.event) && (props.item.event.onDeleteClick)) {
                props.item.event.onDeleteClick(event, child.id)
            }
            reRender()
        }

        if (props.item.data.mode === "edit") {
            if (child.delete) {
                deleteButton = <button className="avatar-delete" onClick={handleDeleteClick}><i className="fa fa-trash"></i></button>
            }
        }
        return <div className="avatar-item">
            <div className="avatar-image">
                <img src={child.avatarImg} style={props.style} alt="user" width={props.width} className={className} />
                {deleteButton}
            </div>
            <div className="avatar-name">
                <span>{child.avatarName}</span>
            </div>
        </div>
    })

    if (props.item.data.mode === "edit") {
        if (props.item.data.avatarOptionList) {
            avatarOptionList = props.item.data.avatarOptionList.map((child) => {
                let className = props.className + " pending"

                function handleClick(event) {
                    if ((props.item) && (props.item.event) && (props.item.event.onOptionSelectClick)) {
                        props.item.event.onOptionSelectClick(event, child.id)
                    }
                    reRender()
                }
                return <li><a className={props.optionClassName} onClick={handleClick}><img src={child.avatarImg} style={props.style} alt="user" width="40" className={className} />{child.displayText}</a></li>

            })
        }
        if (props.item.data.avatarOptionList) {

            addButton = <><button id="avatarListAdd" className="rounded-circle btn btn-info" data-toggle="dropdown" onClick={handleAddClick}><i className="fa fa-plus"></i>
                <span className="caret"></span></button>
                <ul className={"dropdown-menu " + props.optionListClassName}>
                    {avatarOptionList}
                </ul>
            </>
        }
        else {

            addButton = <><button id="avatarListAdd" className="rounded-circle btn btn-info" onClick={handleAddClick}><i className="fa fa-plus"></i>
                <span className="caret"></span></button>
            </>

        }
    }
    avatarList = <>
        <div className="row media-body mr-3">
            {avatarList}
            <div className="col-1">
                {addButton}
            </div>
        </div>
    </>
    return avatarList
}

export function AvatarImg(props) {
    return <img src={props.src} alt="user" width={props.width} className={props.className} />
}

export function MessageListNavigator(props) {
    function handleClick(event, id) {
        if (typeof props.item.event.onClick !== "undefined") {
            props.item.event.onClick(event, id)
        }
    }
    return <FrwkMessageListNavigator {...props} onClick={handleClick} />
}

export function SelectedListItem(props) {
    return props.children
}

export function NonSelectedListItem(props) {
    return props.children
}

export function MessageText(props) {
    //return "Text"
    let item = <div className={props.className} >{props.message}</div>

    return item
}

export function Line3(props) {
    //return "Text"
    let item = <div className={props.className} >{props.line3}</div>

    return item
}
export function Line4(props) {
    //return "Text"
    let item = <div className={props.className} >{props.line4}</div>

    return item
}
export function Line5(props) {
    //return "Text"
    let item = <div className={props.className} >{props.line5}</div>

    return item
}

export function CollapsableText(props) {
    let [rendered, setRendered] = useState(true)

    function reRender() {
        setRendered(!rendered)
    }
    function setValue(value) {
        props.item.data.value = value
        reRender()
    }

    props.item.reRender = reRender
    props.item.setValue = setValue

    return (<div id="module" className="container">
        <p className="collapse" id="collapseExample" aria-expanded="false">{props.item.data.value}
        </p>
        <a role="button" className="collapsed" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"></a>
    </div>
    )
}

export function MessageAction(props) {
    let className = props.className
    if (props.action) {
        className = className + " " + props.action.toLowerCase() + "-action"
    }
    return <div className={className} >{props.action}</div>
}

export function UserName(props) {
    return "Enclose the div that you want to center with a parent element. Enclose the div that you want to center with a parent element."
    return props.children
}

export function PDFViewer(props) {
    let [rendered, setRendered] = useState(true)
    let [show, setShow] = useState(false)

    function reRender() {
        setRendered(!rendered)
    }


    function showPdf(url) {
        setShow(true)
    }
    props.functions.showPdf = showPdf

    function handleClick() {
        setShow(false)
    }

    return (
        <>{show && <div>
            <div className={"modal doc-preview" + (show ? " show d-block" : "")} style={{ background: "rgba(0,0,0,.6)" }} role="dialog" id={props.id}>
                <div className="modal-dialog modal-xl" role="document" style={{ width: "80%" }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h6>{props.source}</h6>
                            <button type="button" className="close" onClick={handleClick}>&times;</button>
                        </div>
                        <div className="modal-body" style={{ height: "530px" }}>
                            <div>
                                <iframe src={props.source} style={{ height: "500px", width: "100%" }} />
                            </div>
                        </div>
                        <div className="modal-footer doc-preview-footer">
                            <button type="button" className="btn btn-danger pdf-preview-btn" onClick={handleClick}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>}</>
    );
}


export function PopUpPage(props) {

    let [rendered, setRendered] = useState(true)
    let [show, setShow] = useState(false)

    function reRender() {
        setRendered(!rendered)
    }


    function showPopUp() {
        setShow(true)
    }

    props.item.showPopUp = showPopUp
    //     return (<div className="modal" >
    //     <div className="modal-dialog modal-xl" style={{width:"80%"}}>
    //         <div className="modal-pop-up-content">

    //         <div className="modal-pop-up-header">
    //             <h6>Header</h6>
    //             <button type="button" className="close" data-dismiss="modal">&times;</button>
    //         </div>

    //         <div className="modal-pop-up-body" style={{height:"530px"}}>
    //             <div>
    //                 {props.children}
    //             </div>
    //         </div>

    //         <div className="modal-pop-up-footer">
    //             <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
    //         </div>

    //         </div>
    //     </div>
    // </div>)
    return (
        <>{<PopUPDialog item={props.item} headerText={props.headerText} className={props.className}>
            {props.children}
        </PopUPDialog>}</>
    );
}

export function DateField(props) {
    const [startDate, setStartDate] = useState(new Date());
    let state = props.item.schema.dataSourceController.state

    // if(props.item.data.value!=="")
    //     setStartDate(new Date(props.item.data.value))

    // useEffect(()=>{
    //     setStartDate(new Date(props.item.data.value))
    // }, [props.item.data.value])

    function handleChange(date) {
        props.item.data.value = date
        state.modified = true
        if (typeof props.item.event.onChange !== "undefined") {
            props.item.event.onChange(date)
        }
        setStartDate(date)
        if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
            props.item.schema.dataSourceController.renderControlButtons()
    }

    function setDate(date) {
        props.item.data.value = new Date(date)
        setStartDate(new Date(date))
    }

    props.item.setDate = setDate
    return (
        <DatePicker selected={startDate} dateFormat={props.dateFormat} onChange={handleChange} popperProps={{ strategy: 'fixed' }} />
    );
}

export function PopUp(props) {
    return (<FrwkPopUp {...props}>{props.children}</FrwkPopUp>)
}

export function ContextMenu(props) {
    return (<FrwkContextMenu {...props}>{props.children}</FrwkContextMenu>)
}
export function HtmlEditor(props) {
    return (<FrwkHtmlEditor height={props.height} />)
}

export function SupermarketDashboard(props) {
    let event = {}
    let img = []
    let plainRed = 0
    let plainYellow = 1
    let plainGreen = 2
    let plainBlue = 3
    let fillRed = 4
    let fillGreen = 5
    let statusOnHold = "ON HOLD"
    let statusPlanned = "PLANNED"
    let statusReady = "COMPLETED"
    let statusTrimsReady = "TRIMS READY" //plain-green
    let statusInProgress = "ON PROGRESS" //plain-yellow
    let statusReadyToIssue = "READY TO ISSUE" //green-fill
    let statusTrimsOnHold = "TRIMS ON HOLD" // plain-red
    let statusTrimsPendingToStart = "TRIMS PENDING TO START" //plain-blue
    let statusJobCardOnHold = "JOB CARD ON HOLD" //fill-red

    let [loadingDivCss, setLoadingDivCss] = useState(false)
    //Job Card Pool - plain +  Green fill + plain-blue

    //In lines -


    img[0] = <img className={"drag-image"} draggable={false} src={sim0} />
    img[1] = <img className={"drag-image"} draggable={false} src={sim1} />
    img[2] = <img className={"drag-image"} draggable={false} src={sim2} />
    img[3] = <img className={"drag-image"} draggable={false} src={sim3} />
    img[4] = <img className={"drag-image"} draggable={false} src={sim4} />
    img[5] = <img className={"drag-image"} draggable={false} src={sim5} />
    let btn = <button>Trial</button>
    let [rendered, setRendered] = useState(true)

    function reRender() {
        setRendered(!rendered)
    }


    function jobCardMoved(event, from, to, index) {
        let jobCard
        let fromJobCard
        let toJobCard
        setLoadingDivCss(true)
        reRender()

        if (typeof props.item.event.onJobCardMoved !== 'undefined') {
            if ((typeof from === 'undefined') || (from === null)) {
                jobCard = props.item.dataJson.jobCardPool.jobCards[index]
                fromJobCard = "POOL"
                toJobCard = props.item.dataJson.lines[to].lineId
            }
            else if ((typeof to === 'undefined') || (to === null)) {
                jobCard = props.item.dataJson.lines[from].jobCards[index]
                fromJobCard = props.item.dataJson.lines[from].lineId
                toJobCard = "POOL"
            }
            else {
                jobCard = props.item.dataJson.lines[from].jobCards[index]
                fromJobCard = props.item.dataJson.lines[from].lineId
                toJobCard = props.item.dataJson.lines[to].lineId
            }
            props.item.event.onJobCardMoved(event, fromJobCard, toJobCard, jobCard, () => {
                // if((typeof from==='undefined')||(from===null)){
                //     props.item.dataJson.lines[to].jobCards.push(props.item.dataJson.jobCardPool.jobCards[index])
                //     props.item.dataJson.jobCardPool.jobCards.splice(index,1)
                // }
                // else if((typeof to==='undefined')||(to===null)){
                //     props.item.dataJson.jobCardPool.jobCards.push(props.item.dataJson.lines[from].jobCards[index])
                //     props.item.dataJson.lines[from].jobCards.splice(index,1)
                // }
                // else{
                //     props.item.dataJson.lines[to].jobCards.push(props.item.dataJson.lines[from].jobCards[index])
                //     props.item.dataJson.lines[from].jobCards.splice(index,1)
                // }
                setLoadingDivCss(false)
                reRender()
            })
        }
    }

    event.jobCardMoved = jobCardMoved

    function getJobCards(poolData, lineIndex) {


        //let poolData = props.item.jobCardPool.jobCards

        let jobCardPoolItem = Object.keys(poolData).map((index) => {
            let draggableObj =
                <><DraggableObject data-tip="hello world" id={poolData[index].id} item={poolData[index]} menuStatus={poolData[index].menuStatus} index={index} menuItems={props.item.menuItems} lineIndex={lineIndex} className="drag-object" event={props.item.event} object={img[poolData[index].imgIndex]} status={poolData[index].status} description={poolData[index].description} localEvent={event} /><ReactTooltip /></>


            return (draggableObj)

        })
        return jobCardPoolItem
    }

    function getLines() {
        let lines = props.item.dataJson.lines

        let jobCardLines = Object.keys(lines).map((index) => {
            return (
                <div className="job-card-line">
                    <div className="col-12 header">
                        <div className="row">
                            <div className="col-6 left-header">{lines[index].name}</div>
                            <div className="col-6 right-header">{lines[index].description}</div>
                        </div>
                    </div>
                    {/* <div className="header" width="400">
                    {lines[index].description}
                    </div> */}
                    {<DropZone className="body" lineIndex={index} localEvent={event}>{getJobCards(lines[index].jobCards, index)}</DropZone>}
                </div>)
        })
        return jobCardLines
    }

    function loadJobCard(newDataJson) {
        props.item.dataJson = JSON.parse(JSON.stringify(newDataJson))
        reRender()
    }

    props.item.loadJobCard = loadJobCard

    if ((typeof props.item.dataJson !== 'undefined') && (typeof props.item.dataJson.jobCardPool !== 'undefined') && (typeof props.item.dataJson.jobCardPool.jobCards !== 'undefined')) {
        return (<div className="col">
            <div className="job-card-pending-pool">
                <div data-tip="Job Card Pool" className="header" width="400" height="30">
                    JOB CARD POOL
                </div><ReactTooltip />
                {<><DropZone className="body" height="30" localEvent={event}>
                    {getJobCards(props.item.dataJson.jobCardPool.jobCards)}
                </DropZone></>}
            </div>
            <div className="row job-card-line-holder">
                {getLines()}
            </div>
            {loadingDivCss && <div className={"loading-dash-board"} id="loadingDashBoardDragId"></div>}
        </div>)
    }
    else {
        return (<></>)
    }
}


export function ProductionDashboard(props) {
    let event = {}
    let img = []
    let plainRed = 0
    let plainYellow = 1
    let plainGreen = 2
    let plainBlue = 3
    let fillRed = 4
    let fillGreen = 5
    let statusOnHold = "ON HOLD"
    let statusPlanned = "PLANNED"
    let statusReady = "COMPLETED"
    let statusTrimsReady = "TRIMS READY" //plain-green
    let statusInProgress = "ON PROGRESS" //plain-yellow
    let statusReadyToIssue = "READY TO ISSUE" //green-fill
    let statusTrimsOnHold = "ON HOLD" // plain-red
    let statusTrimsPendingToStart = "TRIMS PENDING TO START" //plain-blue
    let statusJobCardOnHold = "JOB CARD ON HOLD" //fill-red

    let popupActions = {}

    let [loadingDivCss, setLoadingDivCss] = useState(false)
    //Job Card Pool - plain +  Green fill + plain-blue

    //In lines -


    //img[0] = <img className={"drag-image"} draggable={false} src={require("../_images/red-outline-shirt.svg")} />
    img[0] = <img className={"drag-image"} draggable={false} src={pim0} />
    //img[1] = <img className={"drag-image"} draggable={false} src={require("../_images/ornage-outline-shirt.svg")} />
    img[1] = <img className={"drag-image"} draggable={false} src={pim1} />
    //img[2] = <img className={"drag-image"} draggable={false} src={require("../_images/green-outlne-shirt.svg")} />
    img[2] = <img className={"drag-image"} draggable={false} src={pim2} />
    //img[3] = <img className={"drag-image"} draggable={false} src={require("../_images/blue-outline-shirt.svg")} />
    img[3] = <img className={"drag-image"} draggable={false} src={pim3} />
    img[4] = <img className={"drag-image"} draggable={false} src={pim4} />
    img[5] = <img className={"drag-image"} draggable={false} src={pim4} />
    let btn = <button>Trial</button>
    let [rendered, setRendered] = useState(true)
    let popupOwner = <></>
    let functions = {}

    function reRender() {
        setRendered(!rendered)
    }

    function getJobCards(poolData, lineIndex) {
        //let poolData = props.item.jobCardPool.jobCards
        let jobCardPoolItem = Object.keys(poolData).map((index) => {
            let draggableObj = <div id={poolData[index].id} className="drag-object" menuStatus={poolData[index].menuStatus} >{img[poolData[index].imgIndex]}</div>

            let hybrid =
                <ContextMenu component={draggableObj} functions={functions}>
                    <div >
                        <a onClick={handleViewJobCard}><b>{poolData[index].description}</b> View Details</a>
                        <a onClick={handleStatusChange}><b>{poolData[index].description}</b> Change Status</a>
                    </div>
                </ContextMenu>

            function handleViewJobCard(event) {
                if (typeof props.item.event.onViewJobCard !== "undefined") {
                    props.item.event.onViewJobCard(event, poolData[index].id)
                }
            }
            function handleStatusChange(event) {
                if (typeof props.item.event.onChangeJobCard !== "undefined") {
                    props.item.event.onChangeJobCard(event, poolData[index].id)
                }
            }
            return (hybrid)

        })
        return jobCardPoolItem
    }

    function getLines() {
        let jobCardLines = <></>
        let lines
        if ((typeof props.item.dataJson !== 'undefined') && (typeof props.item.dataJson.lines !== 'undefined')) {
            lines = props.item.dataJson.lines

            jobCardLines = Object.keys(lines).map((index) => {
                return (
                    <div className="job-card-line">
                        <div className="col-12 header">
                            <div className="row">
                                <div className="col-6 left-header">{lines[index].name}</div>
                                <div className="col-6 right-header">{lines[index].description}</div>
                            </div>
                        </div>
                        {/* <div className="header" width="400">
                        {lines[index].description}
                        </div> */}
                        {<div className="body" >{getJobCards(lines[index].jobCards, index)}</div>}
                    </div>)
            })
        }
        return jobCardLines
    }


    function loadJobCard(newDataJson) {
        props.item.dataJson = JSON.parse(JSON.stringify(newDataJson))
        reRender()
    }

    props.item.loadJobCard = loadJobCard
    if ((typeof props.item.dataJson !== 'undefined') && (typeof props.item.dataJson.lines !== 'undefined')) {
        return (
            <div className="col">
                <div className="row job-card-line-holder">
                    {getLines()}
                </div>
                {loadingDivCss && <div className={"loading-dash-board"} id="loadingDashBoardDragId"></div>}
            </div>)
    }
    else {
        return (<></>)
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////
//                                      HANDSON TABLE                                           //
//////////////////////////////////////////////////////////////////////////////////////////////////

export function HandsOnTable04082025(props) {

    registerAllModules();
    let [rendered, setRendered] = useState(false)
    const hotRef = useRef(null);
    let state = props.item.schema.dataSourceController.state;
    let hidden_columns = (props.item.hidden_column) ? props.item.hidden_column : [];
    let hidden_rows = (props.item.hidden_rows) ? props.item.hidden_rows : [];
    // let [hidden_rows,setHiddenRows] = useState((props.item.hidden_rows) ? props.item.hidden_rows : [])
    let col = props.item.columns;

    let current_row = -1;
    let current_col = -1;
    let changeLog = [];
    let cellMetaData = [];

    let rangeSelected = false;
    let pastedArray = [];
    const key = props.item.name;

    function hotRender() {
        const hot = hotRef.current.hotInstance;
        hot.render();

    }

    function reRender() {

        setRendered(!rendered)
    }


    let _rowstate = col.some(item => '_rowstate' === item.title);
    if (!_rowstate) {
        addDefaultField();
    };

    function addDefaultField() {
        col.push({ title: '_rowstate', type: 'text', data: '_rowstate', customDataType: 'text', readOnly: true })
        hidden_columns.push(col.length - 1);
        props.item.hidden_column = hidden_columns;
        col.push({ title: 'Delete', type: 'text', data: 'default_row_delete', customDataType: 'text', readOnly: true, className: 'htCenter' })
        col.push({ title: 'Edit', type: 'text', data: 'default_row_edit1', customDataType: 'text', readOnly: true, className: 'htCenter' })

    }

    function afterChange(array, cellStatus) {

        if (array != null) {
            changeLog = array[0];
            const hot = hotRef.current.hotInstance;
            const activeEditor = hot.getActiveEditor();
            if (activeEditor != null) {
                activeEditor.beginEditing()
            }

            state.modified = true
            if (props.item.data[hot.toPhysicalRow(array[0][0])]['_rowstate'] == 'POPULATED') {
                props.item.data[hot.toPhysicalRow(array[0][0])]['_rowstate'] = 'MODIFIED'
            }

            if (typeof props.item.event.onChange !== 'undefined') {
                props.item.event.onChange("onChanged", hot.toPhysicalRow(array[0][0]), hot.toPhysicalColumn(array[0][1]))
            }
            if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
                props.item.schema.dataSourceController.renderControlButtons()

            //hotRender();
        }


    }

    function afterDeselect() {

        if (typeof props.item.event.afterChange !== 'undefined' && changeLog.length > 0) {
            if (changeLog[2] != changeLog[3]) {
                const hot = hotRef.current.hotInstance;
                props.item.event.afterChange('afterChanged', hot.toPhysicalRow(changeLog[0][0]), hot.toPhysicalColumn(changeLog[0][1]));
                changeLog = [];
            }

        }
    }

    function afterDrawSelection(row, col, cornersOfSelection) {
        const hot = hotRef.current.hotInstance;

        if ((!(row == current_row && col == current_col) && changeLog.length > 0) && current_row != -1) {
            if (typeof props.item.event.afterChange !== 'undefined') {

                if (changeLog[2] != changeLog[3]) {
                    props.item.event.afterChange(changeLog);
                    changeLog = [];
                }
            }
        }


        // current_col = hot.toPhysicalColumn(col);
        // current_row = hot.toPhysicalRow(row);

        current_col = col;
        current_row = row;

        if (!(cornersOfSelection[0] == cornersOfSelection[2] && cornersOfSelection[1] == cornersOfSelection[3])) {
            rangeSelected = true;
        } else {
            rangeSelected = false;
        }


    }

    function afterDocumentKeyDown(array) {
        if (!rangeSelected && current_row != -1 && current_col != -1) {
            const hot = hotRef.current.hotInstance;
            hot.validateCells(() => {
                const cellMeta = hot.getCellMeta(current_row, current_col);
                const row = cellMeta.row;
                const col = cellMeta.col;
                // const row = current_row;
                // const col = current_col;

                const activeEditor = hot.getActiveEditor();

                if (typeof (activeEditor) != 'undefined') {
                    console.log(activeEditor);
                    const pre_value = hot.getDataAtCell(row, col);
                    const cur_value = activeEditor.getValue();
                    if (cellMeta.additional_type == 'integer') {
                        if (Number.isInteger(Number(cur_value))) {
                            hot.setDataAtCell(current_row, current_col, ((parseInt(cur_value) >= 0) ? parseInt(cur_value) : ""));

                        } else {
                            hot.setDataAtCell(current_row, current_col, pre_value);

                        }
                    } else if (cellMeta.additional_type == 'number') {
                        if (!(Number.isNaN(Number(cur_value)))) {
                            hot.setDataAtCell(current_row, current_col, cur_value);

                        } else {
                            hot.setDataAtCell(current_row, current_col, pre_value);

                        }
                    }
                    else {
                        hot.setDataAtCell(current_row, current_col, cur_value);

                    }
                }
            })
        }

    }

    function beforePaste(data, coords) {

        pastedArray = [];
        const hot = hotRef.current.hotInstance;

        let startCol = parseInt(coords[0].startCol);
        let endCol = parseInt(coords[0].endCol);
        let startRow = parseInt(coords[0].startRow);
        let endRow = parseInt(coords[0].endRow);

        for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
                const value = hot.getDataAtCell(i, j);
                pastedArray.push(value);

            }

        }
        console.log(pastedArray)
    }

    async function afterPaste(data, coords) {


        const hot = hotRef.current.hotInstance;
        document.getElementById("spinner").style.display = "";
        hot.validateCells(async () => {

            const fetchData = async () => {


                let startCol = parseInt(coords[0].startCol);
                let endCol = parseInt(coords[0].endCol);
                let startRow = parseInt(coords[0].startRow);
                let endRow = parseInt(coords[0].endRow);

                console.log(pastedArray);
                let index = 0;
                for (let row = startRow; row <= endRow; row++) {
                    for (let col = startCol; col <= endCol; col++) {

                        const cellMeta = hot.getCellMeta(row, col);
                        const pre_value = pastedArray[index];

                        index++;

                        console.log(pre_value)
                        const cur_value = hot.getDataAtCell(row, col);
                        console.log(cur_value)

                        if (cellMeta.additional_type == 'integer') {
                            if (Number.isInteger(Number(cur_value))) {
                                hot.setDataAtCell(row, col, ((parseInt(cur_value) >= 0) ? parseInt(cur_value) : ""))

                            } else {
                                hot.setDataAtCell(row, col, pre_value);

                            }
                        } else if (cellMeta.additional_type == 'number') {
                            if (!(Number.isNaN(Number(cur_value)))) {
                                hot.setDataAtCell(row, col, cur_value);

                            } else {
                                hot.setDataAtCell(row, col, pre_value);

                            }
                        }
                        else {
                            hot.setDataAtCell(row, col, cur_value);

                        }


                    }

                }
                hotRender()

            }

            await fetchData();
            document.getElementById("spinner").style.display = "none";

        });

    }

    function setRowReadOnly(row) {

        const hot = hotRef.current.hotInstance;

        const data = props.item.data;
        const _rowstate = data[row]['_rowstate'];
        // const hiddenRows = hot.view.wt.wtTable.getRowHeight(row);
        // alert(hiddenRows)

        Object.entries(col).map(([key, value]) => {
            //  key = hot.toPhysicalColumn(key);
            const cellMeta = hot.getCellMeta(row, key);
            let classes = "";
            if (_rowstate != 'DELETED') {
                classes = cellMeta.className;
                classes += " " + "handsontable_row_desabled";
            } else {

                classes = cellMeta.className;
                console.log("CLASS NAME =====" + classes);
            }

            hot.setCellMeta(row, key, 'className', classes)
            hot.setCellMeta(row, key, 'readOnly', true)

        })

        hotRender();


    }

    function getData() {
        let data = props.item.data;
        return data;
    }

    /////////////////////////////// POLULATE DATA ///////////////////////
    function setData(data) {
        console.log(data);

        Object.entries(data).map(([key, value]) => {
            data[key]['_rowstate'] = 'POPULATED';
        })
        props.item.data = data;


        reRender();

    }

    function setColumns(columns) {
        let _rowstate = columns.some(item => '_rowstate' === item.title);
        hidden_columns = [];
        if (!_rowstate) {
            columns.push({ title: '_rowstate', type: 'text', data: '_rowstate', editor: false, customDataType: 'text', readOnly: true })
            hidden_columns.push(columns.length - 1);
            columns.push({ title: 'Delete', type: 'text', data: 'default_row_delete', customDataType: 'text', readOnly: true })
            columns.push({ title: 'Edit', type: 'text', data: 'default_row_edit1', customDataType: 'text', readOnly: true })
            props.item.hidden_column = hidden_columns;
        }
        props.item.columns = columns;
        reRender();
    }

    /////////////////////////////// ADD NEW ROW //////////////////////
    function addRow(dataArray) {
        const hot = hotRef.current.hotInstance;
        // const filtersPlugin = hot.getPlugin('filters');
        // filtersPlugin.clearConditions();
        // // Re-add filters
        // filtersPlugin.filter();

        let rowArray = {};
        rowArray = Object.keys(col).reduce((object, key) => {

            if ((col[key].data) == '_rowstate') {
                object[col[key].data] = (dataArray[(col[key].data)] || 'NEW');
            } else {
                object[col[key].data] = (dataArray[(col[key].data)] || '');
            }
            return object;
        }, {});


        let data = props.item.data;
        data.push(rowArray);
        hot.updateData(data);
        hotRender();


    }
    //////////////////// DELETE BUTTON ///////////////////////
    function deleteButton(instance, td, row, column, prop, value, cellProperties) {
        const hot = hotRef.current.hotInstance;
        row = hot.toPhysicalRow(row);
        column = hot.toPhysicalRow(column);

        Handsontable.renderers.TextRenderer.apply(this, arguments);
        td.innerHTML = '<button id = "' + key + 'delete' + row + '" class="myBt bt-' + row + '" style="border:none;background-color:#fff"><i class="fa fa-trash" style ="color:#007bff"></i></button>';


        if (document.getElementById((key + 'delete' + row + '')) != null) {
            document.getElementById((key + 'delete' + row + '')).onclick = function () {


                let data = props.item.data;
                if (data[row]._rowstate == 'NEW') {
                    // hot.validateCells( async () => {
                    data = data.slice(0);
                    data.splice(row, 1);
                    hot.alter('remove_row', row, 1);
                    // })

                } else {

                    props.item.data[row]['_rowstate'] = 'DELETED'
                    hot.validateCells(async () => {

                        for (let i = 0; i < col.length; i++) {
                            const cellMeta = hot.getCellMeta(row, i);
                            console.log("PPPPPPPPPPPPPPPPPPPP");
                            console.log(cellMeta);
                            let classes = (cellMeta.className != 'undefined') ? cellMeta.className : "";
                            classes = " " + "handsontable_row_delete";
                            hot.setCellMeta(row, i, 'className', classes)
                            hot.setCellMeta(row, i, 'readOnly', true)

                        }
                        hotRender();

                    });



                }

                // Re-render controller
                state.modified = true;
                if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
                    props.item.schema.dataSourceController.renderControlButtons()


                if (typeof props.item.event.onDelete !== 'undefined') {
                    props.item.event.onDelete(row);
                    // console.log(props);
                }
            }

        }

    }

    function CustomeEdit1(instance, td, row, column, prop, value, cellProperties) {
        const hot = hotRef.current.hotInstance;
        row = hot.toPhysicalRow(row);
        column = hot.toPhysicalRow(column);
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        td.innerHTML = '<button id = "' + key + 'edit1' + row + '" class="myBt bt-' + row + '" style="border:none;background-color:#fff"><i class="fas fa-edit" style ="color:#007bff"></i></button>';

        if (document.getElementById((key + 'edit1' + row + '')) != null) {
            document.getElementById((key + 'edit1' + row + '')).onclick = function () {
                hot.validateCells(async () => {
                    hotRender();
                });

                if (typeof props.item.event.onCustomeEdit1 !== 'undefined') {
                    props.item.event.onCustomeEdit1("edit", row);
                    // console.log(props);
                }

                // Re-render controller
                state.modified = true;
                if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
                    props.item.schema.dataSourceController.renderControlButtons()

            }


        }
    }

    async function beforeRender(isForced) {
        let data = props.item.data;

        if (hotRef.current != null) {
            const hot = hotRef.current.hotInstance;
            //hot.validateCells( async () => {
            cellMetaData = hot.getCellsMeta();
            const cm = hot.getCellsMeta();


        }

    }
    function afterRender(isForced) {
        if (hotRef.current != null) {
            const hot = hotRef.current.hotInstance;
            // hot.validateCells(() => {
            console.log("++++++++AFTER+++++++++++")
            const cm = hot.getCellsMeta();
            // console.log(cm.length);


            (Object.entries(cellMetaData).map(([key, value]) => {
                const row = value.row;
                const col = value.col;

                //console.log(value.className);
                var metadata = {
                    readOnly: value.readOnly, // Set cells as read-only
                    className: value.className  // Add a CSS class
                };


            }));
            // });
        }

    }

    function setValueWiltColName(value, row, name) {

        let data = props.item.data;
        data[row][name] = value;
        if (data[row]['_rowstate'] == 'POPULATED') {
            data[row]['_rowstate'] = 'MODIFIED';
        }
        hotRender();
    }

    function getValueWiltColName(row, name) {
        let data = props.item.data;
        return data[row][name];

    }

    function getColumns() {
        return col;
    }

    function hideColumn(col_id) {
        hidden_columns.push(col_id);
        props.item.hidden_column = hidden_columns;
        reRender();
    }

    const settings = {
        colHeaders: true,
        rowHeaders: true,
        width: 'auto',
        height: 400,
        maxHeight: 100,
        contextMenu: true,
        manualColumnFreeze: true,
        fixedRowsTop: 0,
        //fixedColumnsLeft: 0,
        fixedRowsBottom: 0,
        manualColumnMove: true,
        manualColumnResize: true,
        manualRowResize: true,
        manualRowMove: true,

        dropdownMenu: true,
        allowInsertColumn: false,
        allowInsertRow: false,
        allowRemoveColumn: false,
        observeChanges: true,
        // dropdownMenu: ['remove_col', '---------', 'make_read_only', 'alignment'],
        dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar'],

        filters: props.item.schema.filters,
        columnSorting: props.item.schema.sorting,
        comments: true,
        autoWrapRow: true,
        autoWrapCol: true,
        licenseKey: 'non-commercial-and-evaluation',
        columns: col,
        readOnly: false,

        cells: function (row, column) {

            let cellPrp = this;

            if (col[column].data == 'default_row_delete') {
                cellPrp.renderer = deleteButton;
                cellPrp.readOnly = true;
                cellPrp.width = 60;
            }
            else if (col[column].data == 'default_row_edit1') {
                cellPrp.renderer = CustomeEdit1;
                cellPrp.readOnly = true;
                cellPrp.width = 60;
            }

            return cellPrp
        },

        copyPaste: {
            // enable the "Copy with headers" option in the context menu
            copyColumnHeaders: true,

            // enable the "Copy with group headers" option in the context menu
            copyColumnGroupHeaders: true,

            // enable the "Copy headers only" option in the context menu
            copyColumnHeadersOnly: true,
        },
        readOnly: true,

        afterChange: afterChange,
        afterDrawSelection: afterDrawSelection,
        afterDocumentKeyDown: afterDocumentKeyDown,
        beforePaste: beforePaste,
        afterPaste: afterPaste,
        afterDeselect: afterDeselect,
        //   beforeRender:beforeRender,
        //   afterRender:afterRender,



        hiddenColumns: {
            columns: hidden_columns,
            indicators: true,
        },

        hiddenRows: {
            rows: hidden_rows,
            indicators: true
        },
        manualColumnFreeze: true,
        //fixedColumnsStart:3,

    };



    props.item.reRender = reRender;
    props.item.setRowReadOnly = setRowReadOnly;
    props.item.getData = getData;
    props.item.setData = setData;
    props.item.setColumns = setColumns;
    props.item.addRow = addRow;
    props.item.setValueWiltColName = setValueWiltColName;
    props.item.getValueWiltColName = getValueWiltColName;
    props.item.getColumns = getColumns;
    props.item.hideColumn = hideColumn;
    let comp = <>
        <div className="loading" id="spinnerHns" style={{ display: "none" }}>Loading&#8230;</div>
        <HotTable ref={hotRef} data={props.item.data} settings={settings} />

    </>

    return comp;
}

export function HandsOnTable29092025(props) {

    registerAllModules();
    let [rendered, setRendered] = useState(false)
    const hotRef = useRef(null);
    let state = props.item.schema.dataSourceController.state;
    let hidden_columns = (props.item.hidden_column) ? props.item.hidden_column : [];
    let hidden_rows = (props.item.hidden_rows) ? props.item.hidden_rows : [];
    // let [hidden_rows,setHiddenRows] = useState((props.item.hidden_rows) ? props.item.hidden_rows : [])
    let col = props.item.columns;

    let current_row = -1;
    let current_col = -1;
    let changeLog = [];
    let cellMetaData = [];

    let rangeSelected = false;
    let pastedArray = [];
    const key = props.item.name;

    function hotRender() {
        const hot = hotRef.current.hotInstance;
        hot.render();

    }

    function reRender() {

        setRendered(!rendered)
    }


    let _rowstate = col.some(item => '_rowstate' === item.title);
    if (!_rowstate) {
        addDefaultField();
    };

    function addDefaultField() {
        col.push({ title: '_rowstate', type: 'text', data: '_rowstate', customDataType: 'text', readOnly: true })
        hidden_columns.push(col.length - 1);
        props.item.hidden_column = hidden_columns;

        if (props.item.delete) {
            col.push({ title: 'Delete', type: 'text', data: 'default_row_delete', customDataType: 'text', readOnly: true, className: 'htCenter' })
        }

        col.push({ title: 'Edit', type: 'text', data: 'default_row_edit1', customDataType: 'text', readOnly: true, className: 'htCenter' })

    }

    function afterChange(array, cellStatus) {

        if (array != null) {
            changeLog = array[0];
            const hot = hotRef.current.hotInstance;
            const activeEditor = hot.getActiveEditor();
            if (activeEditor != null) {
                activeEditor.beginEditing()
            }

            state.modified = true
            if (props.item.data[hot.toPhysicalRow(array[0][0])]['_rowstate'] == 'POPULATED') {
                props.item.data[hot.toPhysicalRow(array[0][0])]['_rowstate'] = 'MODIFIED'
            }

            if (typeof props.item.event.onChange !== 'undefined') {
                props.item.event.onChange("onChanged", hot.toPhysicalRow(array[0][0]), hot.toPhysicalColumn(array[0][1]))
                props.item.event.afterChange('afterChanged', hot.toPhysicalRow(array[0][0]), hot.toPhysicalColumn(array[0][1]));
            }
            if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
                props.item.schema.dataSourceController.renderControlButtons()

            //hotRender();
        }


    }

    function afterDeselect() {

        if (typeof props.item.event.afterChange !== 'undefined' && changeLog.length > 0) {
            if (changeLog[2] != changeLog[3]) {
                const hot = hotRef.current.hotInstance;
                props.item.event.onChange("onChanged", hot.toPhysicalRow(changeLog[0][0]), hot.toPhysicalColumn(changeLog[0][1]))
                props.item.event.afterChange('afterChanged', hot.toPhysicalRow(changeLog[0][0]), hot.toPhysicalColumn(changeLog[0][1]));
                changeLog = [];
            }

        }
    }

    function afterDrawSelection(row, col, cornersOfSelection) {
        const hot = hotRef.current.hotInstance;

        if ((!(row == current_row && col == current_col) && changeLog.length > 0) && current_row != -1) {
            if (typeof props.item.event.afterChange !== 'undefined') {

                if (changeLog[2] != changeLog[3]) {
                    props.item.event.afterChange(changeLog);
                    changeLog = [];
                }
            }
        }


        // current_col = hot.toPhysicalColumn(col);
        // current_row = hot.toPhysicalRow(row);

        current_col = col;
        current_row = row;

        if (!(cornersOfSelection[0] == cornersOfSelection[2] && cornersOfSelection[1] == cornersOfSelection[3])) {
            rangeSelected = true;
        } else {
            rangeSelected = false;
        }


    }

    function afterDocumentKeyDown(array) {
        if (!rangeSelected && current_row != -1 && current_col != -1) {
            const hot = hotRef.current.hotInstance;
            hot.validateCells(() => {
                const cellMeta = hot.getCellMeta(current_row, current_col);
                const row = cellMeta.row;
                const col = cellMeta.col;
                // const row = current_row;
                // const col = current_col;

                const activeEditor = hot.getActiveEditor();

                if (typeof (activeEditor) != 'undefined') {
                    console.log(activeEditor);
                    const pre_value = hot.getDataAtCell(row, col);
                    const cur_value = activeEditor.getValue();
                    if (cellMeta.additional_type == 'integer') {
                        if (Number.isInteger(Number(cur_value))) {
                            hot.setDataAtCell(current_row, current_col, ((parseInt(cur_value) >= 0) ? parseInt(cur_value) : ""));

                        } else {
                            hot.setDataAtCell(current_row, current_col, pre_value);

                        }
                    } else if (cellMeta.additional_type == 'number') {
                        if (!(Number.isNaN(Number(cur_value)))) {
                            hot.setDataAtCell(current_row, current_col, cur_value);

                        } else {
                            hot.setDataAtCell(current_row, current_col, pre_value);

                        }
                    }
                    else {
                        hot.setDataAtCell(current_row, current_col, cur_value);

                    }
                }
            })
        }

    }

    function beforePaste(data, coords) {

        pastedArray = [];
        const hot = hotRef.current.hotInstance;

        let startCol = parseInt(coords[0].startCol);
        let endCol = parseInt(coords[0].endCol);
        let startRow = parseInt(coords[0].startRow);
        let endRow = parseInt(coords[0].endRow);

        for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
                const value = hot.getDataAtCell(i, j);
                pastedArray.push(value);

            }

        }
        console.log(pastedArray)
    }

    async function afterPaste(data, coords) {


        const hot = hotRef.current.hotInstance;
        document.getElementById("spinner").style.display = "";
        hot.validateCells(async () => {

            const fetchData = async () => {


                let startCol = parseInt(coords[0].startCol);
                let endCol = parseInt(coords[0].endCol);
                let startRow = parseInt(coords[0].startRow);
                let endRow = parseInt(coords[0].endRow);

                console.log(pastedArray);
                let index = 0;
                for (let row = startRow; row <= endRow; row++) {
                    for (let col = startCol; col <= endCol; col++) {

                        const cellMeta = hot.getCellMeta(row, col);
                        const pre_value = pastedArray[index];

                        index++;

                        console.log(pre_value)
                        const cur_value = hot.getDataAtCell(row, col);
                        console.log(cur_value)

                        if (cellMeta.additional_type == 'integer') {
                            if (Number.isInteger(Number(cur_value))) {
                                hot.setDataAtCell(row, col, ((parseInt(cur_value) >= 0) ? parseInt(cur_value) : ""))

                            } else {
                                hot.setDataAtCell(row, col, pre_value);

                            }
                        } else if (cellMeta.additional_type == 'number') {
                            if (!(Number.isNaN(Number(cur_value)))) {
                                hot.setDataAtCell(row, col, cur_value);

                            } else {
                                hot.setDataAtCell(row, col, pre_value);

                            }
                        }
                        else {
                            hot.setDataAtCell(row, col, cur_value);

                        }


                    }

                }
                hotRender()

            }

            await fetchData();
            document.getElementById("spinner").style.display = "none";

        });

    }

    function setRowReadOnly(row) {

        const hot = hotRef.current.hotInstance;

        const data = props.item.data;
        const _rowstate = data[row]['_rowstate'];
        // const hiddenRows = hot.view.wt.wtTable.getRowHeight(row);
        // alert(hiddenRows)

        Object.entries(col).map(([key, value]) => {
            //  key = hot.toPhysicalColumn(key);
            const cellMeta = hot.getCellMeta(row, key);
            let classes = "";
            if (_rowstate != 'DELETED') {
                classes = cellMeta.className;
                classes += " " + "handsontable_row_desabled";
            } else {

                classes = cellMeta.className;
                console.log("CLASS NAME =====" + classes);
            }

            hot.setCellMeta(row, key, 'className', classes)
            hot.setCellMeta(row, key, 'readOnly', true)

        })

        hotRender();


    }

    function getData() {
        let data = props.item.data;
        return data;
    }

    /////////////////////////////// POLULATE DATA ///////////////////////
    function setData(data) {
        console.log(data);

        Object.entries(data).map(([key, value]) => {
            data[key]['_rowstate'] = 'POPULATED';
        })
        props.item.data = data;


        reRender();
        changeColor();

    }

    function setColumns(columns) {
        let _rowstate = columns.some(item => '_rowstate' === item.title);
        hidden_columns = [];
        if (!_rowstate) {
            columns.push({ title: '_rowstate', type: 'text', data: '_rowstate', editor: false, customDataType: 'text', readOnly: true })
            hidden_columns.push(columns.length - 1);

            if (props.item.delete) {
                columns.push({ title: 'Delete', type: 'text', data: 'default_row_delete', customDataType: 'text', readOnly: true })
            }

            columns.push({ title: 'Edit', type: 'text', data: 'default_row_edit1', customDataType: 'text', readOnly: true })
            props.item.hidden_column = hidden_columns;
        }
        props.item.columns = columns;
        reRender();
    }

    /////////////////////////////// ADD NEW ROW //////////////////////
    function addRow(dataArray) {
        const hot = hotRef.current.hotInstance;
        // const filtersPlugin = hot.getPlugin('filters');
        // filtersPlugin.clearConditions();
        // // Re-add filters
        // filtersPlugin.filter();

        let rowArray = {};
        rowArray = Object.keys(col).reduce((object, key) => {

            if ((col[key].data) == '_rowstate') {
                object[col[key].data] = (dataArray[(col[key].data)] || 'NEW');
            } else {
                object[col[key].data] = (dataArray[(col[key].data)] || '');
            }
            return object;
        }, {});


        let data = props.item.data;
        data.push(rowArray);
        hot.updateData(data);
        hotRender();

        changeColor();


    }

    function changeColor() {
        const hot = hotRef.current.hotInstance;

        const data = props.item.data;

        Object.entries(col).map(([key, value]) => {
            //  key = hot.toPhysicalColumn(key);

            data.forEach((index, row) => {
                const _rowstate = data[row]['_rowstate'];
                const cellMeta = hot.getCellMeta(row, key);
                let classes = "";
                classes = cellMeta.className;

                if (_rowstate != "DELETED") {
                    if (row % 2 === 0) {
                        classes += " " + "even-row";
                    } else {
                        classes += " " + "odd-row";
                    }
                }



                hot.setCellMeta(row, key, 'className', classes)
            })

        })

        hotRender();
    }



    //////////////////// DELETE BUTTON ///////////////////////
    function deleteButton(instance, td, row, column, prop, value, cellProperties) {
        const hot = hotRef.current.hotInstance;
        row = hot.toPhysicalRow(row);
        column = hot.toPhysicalRow(column);

        Handsontable.renderers.TextRenderer.apply(this, arguments);
        td.innerHTML = '<button id = "' + key + 'delete' + row + '" class="myBt bt-' + row + '" style="border:none;background-color:#fff"><i class="fa fa-trash" style ="color:#007bff"></i></button>';


        if (document.getElementById((key + 'delete' + row + '')) != null) {
            document.getElementById((key + 'delete' + row + '')).onclick = function () {


                let data = props.item.data;
                if (data[row]._rowstate == 'NEW') {
                    // hot.validateCells( async () => {
                    data = data.slice(0);
                    data.splice(row, 1);
                    hot.alter('remove_row', row, 1);
                    // })

                } else {

                    props.item.data[row]['_rowstate'] = 'DELETED'
                    hot.validateCells(async () => {

                        for (let i = 0; i < col.length; i++) {
                            const cellMeta = hot.getCellMeta(row, i);
                            console.log("PPPPPPPPPPPPPPPPPPPP");
                            console.log(cellMeta);
                            let classes = (cellMeta.className != 'undefined') ? cellMeta.className : "";
                            classes = " " + "handsontable_row_delete";
                            hot.setCellMeta(row, i, 'className', classes)
                            hot.setCellMeta(row, i, 'readOnly', true)

                        }
                        hotRender();

                    });



                }

                // Re-render controller
                state.modified = true;
                if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
                    props.item.schema.dataSourceController.renderControlButtons()


                if (typeof props.item.event.onDelete !== 'undefined') {
                    props.item.event.onDelete(row);
                    // console.log(props);
                }
            }

        }

    }

    function CustomeEdit1(instance, td, row, column, prop, value, cellProperties) {
        const hot = hotRef.current.hotInstance;
        row = hot.toPhysicalRow(row);
        column = hot.toPhysicalRow(column);
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        td.innerHTML = '<button id = "' + key + 'edit1' + row + '" class="myBt bt-' + row + '" style="border:none;background-color:transparent"><i class="fas fa-edit" style ="color:#007bff"></i></button>';

        if (document.getElementById((key + 'edit1' + row + '')) != null) {
            document.getElementById((key + 'edit1' + row + '')).onclick = function () {
                hot.validateCells(async () => {
                    hotRender();
                });

                if (typeof props.item.event.onCustomeEdit1 !== 'undefined') {
                    props.item.event.onCustomeEdit1("edit", row);
                    // console.log(props);
                }

                // Re-render controller
                state.modified = true;
                if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
                    props.item.schema.dataSourceController.renderControlButtons()

            }


        }
    }

    async function beforeRender(isForced) {
        let data = props.item.data;

        if (hotRef.current != null) {
            const hot = hotRef.current.hotInstance;
            //hot.validateCells( async () => {
            cellMetaData = hot.getCellsMeta();
            const cm = hot.getCellsMeta();


        }

    }
    function afterRender(isForced) {
        if (hotRef.current != null) {
            const hot = hotRef.current.hotInstance;
            // hot.validateCells(() => {
            console.log("++++++++AFTER+++++++++++")
            const cm = hot.getCellsMeta();
            // console.log(cm.length);


            (Object.entries(cellMetaData).map(([key, value]) => {
                const row = value.row;
                const col = value.col;

                //console.log(value.className);
                var metadata = {
                    readOnly: value.readOnly, // Set cells as read-only
                    className: value.className  // Add a CSS class
                };


            }));
            // });
        }

    }

    function setValueWiltColName(value, row, name) {

        let data = props.item.data;
        data[row][name] = value;
        if (data[row]['_rowstate'] == 'POPULATED') {
            data[row]['_rowstate'] = 'MODIFIED';
        }
        hotRender();
    }

    function getValueWiltColName(row, name) {
        let data = props.item.data;
        return data[row][name];

    }

    function getColumns() {
        return col;
    }

    function hideColumn(col_id) {
        hidden_columns.push(col_id);
        props.item.hidden_column = hidden_columns;
        reRender();
    }

    const settings = {
        colHeaders: true,
        rowHeaders: true,
        width: 'auto',
        height: 400,
        maxHeight: 150,
        contextMenu: true,
        manualColumnFreeze: true,
        fixedRowsTop: 0,
        fixedColumnsLeft: 0,
        fixedRowsBottom: 0,
        manualColumnMove: true,
        manualColumnResize: true,
        manualRowResize: true,
        manualRowMove: true,

        dropdownMenu: true,
        allowInsertColumn: false,
        allowInsertRow: false,
        allowRemoveColumn: false,
        observeChanges: true,
        // dropdownMenu: ['remove_col', '---------', 'make_read_only', 'alignment'],
        dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar'],

        filters: props.item.schema.filters,
        columnSorting: props.item.schema.sorting,
        comments: true,
        autoWrapRow: true,
        autoWrapCol: true,
        licenseKey: 'non-commercial-and-evaluation',
        columns: col,
        readOnly: false,

        cells: function (row, column) {

            let cellPrp = this;


            if (col[column].data == 'default_row_delete' && props.item.delete) {
                cellPrp.renderer = deleteButton;
                cellPrp.readOnly = true;
                cellPrp.width = 60;
            }
            else if (col[column].data == 'default_row_edit1') {
                cellPrp.renderer = CustomeEdit1;
                cellPrp.readOnly = true;
                cellPrp.width = 60;
            }

            return cellPrp
        },

        copyPaste: {
            // enable the "Copy with headers" option in the context menu
            copyColumnHeaders: true,

            // enable the "Copy with group headers" option in the context menu
            copyColumnGroupHeaders: true,

            // enable the "Copy headers only" option in the context menu
            copyColumnHeadersOnly: true,
        },

        afterChange: afterChange,

        hiddenColumns: {
            columns: hidden_columns,
            indicators: true,
        },

        hiddenRows: {
            rows: hidden_rows,
            indicators: true
        },

    };



    props.item.reRender = reRender;
    props.item.setRowReadOnly = setRowReadOnly;
    props.item.getData = getData;
    props.item.setData = setData;
    props.item.setColumns = setColumns;
    props.item.addRow = addRow;
    props.item.setValueWiltColName = setValueWiltColName;
    props.item.getValueWiltColName = getValueWiltColName;
    props.item.getColumns = getColumns;
    props.item.hideColumn = hideColumn;
    let comp = <>
        <div className="loading" id="spinnerHns" style={{ display: "none" }}>Loading&#8230;</div>
        <HotTable ref={hotRef} data={props.item.data} settings={settings} />

    </>

    return comp;
}

export function HandsOnTable(props) {

    registerAllModules();
    let [rendered, setRendered] = useState(false)
    const hotRef = useRef(null);
    let state = props.item.schema.dataSourceController.state;
    let hidden_columns = (props.item.hidden_column) ? props.item.hidden_column : [];
    let hidden_rows = (props.item.hidden_rows) ? props.item.hidden_rows : [];
    // let [hidden_rows,setHiddenRows] = useState((props.item.hidden_rows) ? props.item.hidden_rows : [])
    let col = props.item.columns;

    let current_row = -1;
    let current_col = -1;
    let changeLog = [];
    let cellMetaData = [];

    let rangeSelected = false;
    let pastedArray = [];
    const key = props.item.name;

    function hotRender() {
        const hot = hotRef.current.hotInstance;
        hot.render();

    }

    function reRender() {

        setRendered(!rendered)
    }


    let _rowstate = col.some(item => '_rowstate' === item.title);
    if (!_rowstate) {
        addDefaultField();
    };

    function addDefaultField() {
        col.push({ title: '_rowstate', type: 'text', data: '_rowstate', customDataType: 'text', readOnly: true })
        hidden_columns.push(col.length - 1);


        // hidden_columns.push(col.length-1);
        props.item.hidden_column = hidden_columns;

        if (props.item.schema.delete) {
            col.push({ title: 'Delete', type: 'text', data: 'default_row_delete', customDataType: 'text', readOnly: true, className: 'htCenter' })
        } if (props.item.schema.edit) {
            col.push({ title: 'Edit', type: 'text', data: 'default_row_edit1', customDataType: 'text', readOnly: true, className: 'htCenter' })
        }



    }

    function afterChange(array, cellStatus) {

        if (array != null) {
            changeLog = array[0];
            const hot = hotRef.current.hotInstance;
            const activeEditor = hot.getActiveEditor();
            if (activeEditor != null) {
                activeEditor.beginEditing()
            }

            state.modified = true
            if (props.item.data[hot.toPhysicalRow(array[0][0])]['_rowstate'] == 'POPULATED') {
                props.item.data[hot.toPhysicalRow(array[0][0])]['_rowstate'] = 'MODIFIED'
            }

            if (typeof props.item.event.onChange !== 'undefined') {
                props.item.event.onChange("onChanged", hot.toPhysicalRow(array[0][0]), hot.toPhysicalColumn(array[0][1]))
                props.item.event.afterChange('afterChanged', hot.toPhysicalRow(array[0][0]), hot.toPhysicalColumn(array[0][1]));
            }
            if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
                props.item.schema.dataSourceController.renderControlButtons()

            //hotRender();
        }


    }

    function afterDeselect() {

        if (typeof props.item.event.afterChange !== 'undefined' && changeLog.length > 0) {
            if (changeLog[2] != changeLog[3]) {
                const hot = hotRef.current.hotInstance;
                props.item.event.onChange("onChanged", hot.toPhysicalRow(changeLog[0][0]), hot.toPhysicalColumn(changeLog[0][1]))
                props.item.event.afterChange('afterChanged', hot.toPhysicalRow(changeLog[0][0]), hot.toPhysicalColumn(changeLog[0][1]));
                changeLog = [];
            }

        }
    }

    function afterDrawSelection(row, col, cornersOfSelection) {
        const hot = hotRef.current.hotInstance;

        if ((!(row == current_row && col == current_col) && changeLog.length > 0) && current_row != -1) {
            if (typeof props.item.event.afterChange !== 'undefined') {

                if (changeLog[2] != changeLog[3]) {
                    props.item.event.afterChange(changeLog);
                    changeLog = [];
                }
            }
        }


        // current_col = hot.toPhysicalColumn(col);
        // current_row = hot.toPhysicalRow(row);

        current_col = col;
        current_row = row;

        if (!(cornersOfSelection[0] == cornersOfSelection[2] && cornersOfSelection[1] == cornersOfSelection[3])) {
            rangeSelected = true;
        } else {
            rangeSelected = false;
        }


    }

    function afterDocumentKeyDown(array) {
        if (!rangeSelected && current_row != -1 && current_col != -1) {
            const hot = hotRef.current.hotInstance;
            hot.validateCells(() => {
                const cellMeta = hot.getCellMeta(current_row, current_col);
                const row = cellMeta.row;
                const col = cellMeta.col;
                // const row = current_row;
                // const col = current_col;

                const activeEditor = hot.getActiveEditor();

                if (typeof (activeEditor) != 'undefined') {
                    console.log(activeEditor);
                    const pre_value = hot.getDataAtCell(row, col);
                    const cur_value = activeEditor.getValue();
                    if (cellMeta.additional_type == 'integer') {
                        if (Number.isInteger(Number(cur_value))) {
                            hot.setDataAtCell(current_row, current_col, ((parseInt(cur_value) >= 0) ? parseInt(cur_value) : ""));

                        } else {
                            hot.setDataAtCell(current_row, current_col, pre_value);

                        }
                    } else if (cellMeta.additional_type == 'number') {
                        if (!(Number.isNaN(Number(cur_value)))) {
                            hot.setDataAtCell(current_row, current_col, cur_value);

                        } else {
                            hot.setDataAtCell(current_row, current_col, pre_value);

                        }
                    }
                    else {
                        hot.setDataAtCell(current_row, current_col, cur_value);

                    }
                }
            })
        }

    }

    function beforePaste(data, coords) {

        pastedArray = [];
        const hot = hotRef.current.hotInstance;

        let startCol = parseInt(coords[0].startCol);
        let endCol = parseInt(coords[0].endCol);
        let startRow = parseInt(coords[0].startRow);
        let endRow = parseInt(coords[0].endRow);

        for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
                const value = hot.getDataAtCell(i, j);
                pastedArray.push(value);

            }

        }
        console.log(pastedArray)
    }

    async function afterPaste(data, coords) {


        const hot = hotRef.current.hotInstance;
        document.getElementById("spinner").style.display = "";
        hot.validateCells(async () => {

            const fetchData = async () => {


                let startCol = parseInt(coords[0].startCol);
                let endCol = parseInt(coords[0].endCol);
                let startRow = parseInt(coords[0].startRow);
                let endRow = parseInt(coords[0].endRow);

                console.log(pastedArray);
                let index = 0;
                for (let row = startRow; row <= endRow; row++) {
                    for (let col = startCol; col <= endCol; col++) {

                        const cellMeta = hot.getCellMeta(row, col);
                        const pre_value = pastedArray[index];

                        index++;

                        console.log(pre_value)
                        const cur_value = hot.getDataAtCell(row, col);
                        console.log(cur_value)

                        if (cellMeta.additional_type == 'integer') {
                            if (Number.isInteger(Number(cur_value))) {
                                hot.setDataAtCell(row, col, ((parseInt(cur_value) >= 0) ? parseInt(cur_value) : ""))

                            } else {
                                hot.setDataAtCell(row, col, pre_value);

                            }
                        } else if (cellMeta.additional_type == 'number') {
                            if (!(Number.isNaN(Number(cur_value)))) {
                                hot.setDataAtCell(row, col, cur_value);

                            } else {
                                hot.setDataAtCell(row, col, pre_value);

                            }
                        }
                        else {
                            hot.setDataAtCell(row, col, cur_value);

                        }


                    }

                }
                hotRender()

            }

            await fetchData();
            document.getElementById("spinner").style.display = "none";

        });

    }

    function setRowReadOnly(row) {

        const hot = hotRef.current.hotInstance;

        const data = props.item.data;
        const _rowstate = data[row]['_rowstate'];
        // const hiddenRows = hot.view.wt.wtTable.getRowHeight(row);
        // alert(hiddenRows)

        Object.entries(col).map(([key, value]) => {
            //  key = hot.toPhysicalColumn(key);
            const cellMeta = hot.getCellMeta(row, key);
            let classes = "";
            if (_rowstate != 'DELETED') {
                classes = cellMeta.className;
                classes += " " + "handsontable_row_desabled";
            } else {

                classes = cellMeta.className;
                console.log("CLASS NAME =====" + classes);
            }

            hot.setCellMeta(row, key, 'className', classes)
            hot.setCellMeta(row, key, 'readOnly', true)

        })

        hotRender();


    }

    function getData() {
        let data = props.item.data;
        return data;
    }

    /////////////////////////////// POLULATE DATA ///////////////////////
    function setData(data) {
        console.log(data);

        Object.entries(data).map(([key, value]) => {
            data[key]['_rowstate'] = 'POPULATED';
        })
        props.item.data = data;


        reRender();
        changeColor();

    }

    function setColumns(columns) {
        let _rowstate = columns.some(item => '_rowstate' === item.title);
        hidden_columns = [];
        if (!_rowstate) {
            columns.push({ title: '_rowstate', type: 'text', data: '_rowstate', editor: false, customDataType: 'text', readOnly: true })
            hidden_columns.push(columns.length - 1);

            if (props.item.schema.delete) {
                columns.push({ title: 'Delete', type: 'text', data: 'default_row_delete', customDataType: 'text', readOnly: true })
            }
            if (props.item.schema.edit) {
                columns.push({ title: 'Edit', type: 'text', data: 'default_row_edit1', customDataType: 'text', readOnly: true })
            }
            props.item.hidden_column = hidden_columns;
        }
        props.item.columns = columns;
        reRender();
    }

    /////////////////////////////// ADD NEW ROW //////////////////////
    function addRow(dataArray) {
        const hot = hotRef.current.hotInstance;
        // const filtersPlugin = hot.getPlugin('filters');
        // filtersPlugin.clearConditions();
        // // Re-add filters
        // filtersPlugin.filter();

        let rowArray = {};
        rowArray = Object.keys(col).reduce((object, key) => {

            if ((col[key].data) == '_rowstate') {
                object[col[key].data] = (dataArray[(col[key].data)] || 'NEW');
            } else {
                object[col[key].data] = (dataArray[(col[key].data)] || '');
            }
            return object;
        }, {});


        let data = props.item.data;
        data.push(rowArray);
        hot.updateData(data);
        hotRender();

        changeColor();


    }

    function changeColor() {
        const hot = hotRef.current.hotInstance;

        const data = props.item.data;

        Object.entries(col).map(([key, value]) => {
            //  key = hot.toPhysicalColumn(key);

            data.forEach((index, row) => {
                const _rowstate = data[row]['_rowstate'];
                const cellMeta = hot.getCellMeta(row, key);
                let classes = "";
                classes = cellMeta.className;

                if (_rowstate != "DELETED") {
                    if (row % 2 === 0) {
                        classes += " " + "even-row";
                    } else {
                        classes += " " + "odd-row";
                    }
                }



                hot.setCellMeta(row, key, 'className', classes)
            })

        })

        hotRender();
    }



    //////////////////// DELETE BUTTON ///////////////////////
    function deleteButton(instance, td, row, column, prop, value, cellProperties) {
        const hot = hotRef.current.hotInstance;
        row = hot.toPhysicalRow(row);
        column = hot.toPhysicalRow(column);

        Handsontable.renderers.TextRenderer.apply(this, arguments);
        td.innerHTML = '<button id = "' + key + 'delete' + row + '" class="myBt bt-' + row + '" style="border:none; background-color:transparent"><i class="fa fa-trash" style ="color:#007bff"></i></button>';


        if (document.getElementById((key + 'delete' + row + '')) != null) {
            document.getElementById((key + 'delete' + row + '')).onclick = function () {


                let data = props.item.data;
                if (data[row]._rowstate == 'NEW') {
                    // hot.validateCells( async () => {
                    data = data.slice(0);
                    data.splice(row, 1);
                    hot.alter('remove_row', row, 1);
                    // })

                } else {

                    props.item.data[row]['_rowstate'] = 'DELETED'
                    hot.validateCells(async () => {

                        for (let i = 0; i < col.length; i++) {
                            const cellMeta = hot.getCellMeta(row, i);
                            console.log("PPPPPPPPPPPPPPPPPPPP");
                            console.log(cellMeta);
                            let classes = (cellMeta.className != 'undefined') ? cellMeta.className : "";
                            classes = " " + "handsontable_row_delete";
                            hot.setCellMeta(row, i, 'className', classes)
                            hot.setCellMeta(row, i, 'readOnly', true)

                        }
                        hotRender();

                    });



                }

                // Re-render controller
                state.modified = true;
                if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
                    props.item.schema.dataSourceController.renderControlButtons()


                if (typeof props.item.event.onDelete !== 'undefined') {
                    props.item.event.onDelete(row);
                    // console.log(props);
                }
            }

        }

    }

    function CustomeEdit1(instance, td, row, column, prop, value, cellProperties) {
        if (hotRef.current != null) {
            const hot = hotRef.current.hotInstance;
            row = hot.toPhysicalRow(row);
            column = hot.toPhysicalRow(column);
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            td.innerHTML = '<button id = "' + key + 'edit1' + row + '" class="myBt bt-' + row + '" style="border:none; background-color:transparent"><i class="fas fa-edit" style ="color:#007bff"></i></button>';

            if (document.getElementById((key + 'edit1' + row + '')) != null) {
                document.getElementById((key + 'edit1' + row + '')).onclick = function () {
                    hot.validateCells(async () => {
                        hotRender();
                    });

                    if (typeof props.item.event.onCustomeEdit1 !== 'undefined') {
                        props.item.event.onCustomeEdit1("edit", row);
                        // console.log(props);
                    }

                    // Re-render controller
                    state.modified = true;
                    if (typeof props.item.schema.dataSourceController.renderControlButtons !== "undefined")
                        props.item.schema.dataSourceController.renderControlButtons()

                }


            }
        }
    }

    async function beforeRender(isForced) {
        let data = props.item.data;

        if (hotRef.current != null) {
            const hot = hotRef.current.hotInstance;
            //hot.validateCells( async () => {
            cellMetaData = hot.getCellsMeta();
            const cm = hot.getCellsMeta();


        }

    }
    function afterRender(isForced) {
        if (hotRef.current != null) {
            const hot = hotRef.current.hotInstance;
            // hot.validateCells(() => {
            console.log("++++++++AFTER+++++++++++")
            const cm = hot.getCellsMeta();
            // console.log(cm.length);


            (Object.entries(cellMetaData).map(([key, value]) => {
                const row = value.row;
                const col = value.col;

                //console.log(value.className);
                var metadata = {
                    readOnly: value.readOnly, // Set cells as read-only
                    className: value.className  // Add a CSS class
                };


            }));
            // });
        }

    }

    function setValueWiltColName(value, row, name) {

        let data = props.item.data;
        data[row][name] = value;
        if (data[row]['_rowstate'] == 'POPULATED') {
            data[row]['_rowstate'] = 'MODIFIED';
        }
        hotRender();
    }

    function getValueWiltColName(row, name) {
        let data = props.item.data;
        return data[row][name];

    }

    function getColumns() {
        return col;
    }

    function hideColumn(col_id) {
        hidden_columns.push(col_id);
        props.item.hidden_column = hidden_columns;
        reRender();
    }

    const settings = {
        colHeaders: true,
        rowHeaders: true,
        width: 'auto',
        height: 400,
        maxHeight: 100,
        contextMenu: true,
        manualColumnFreeze: true,
        fixedRowsTop: 0,
        fixedColumnsLeft: 0,
        fixedRowsBottom: 0,
        manualColumnMove: true,
        manualColumnResize: true,
        manualRowResize: true,
        manualRowMove: false,

        dropdownMenu: true,
        allowInsertColumn: false,
        allowInsertRow: false,
        allowRemoveColumn: false,
        observeChanges: true,
        // dropdownMenu: ['remove_col', '---------', 'make_read_only', 'alignment'],
        dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar'],

        filters: props.item.schema.filters,
        columnSorting: props.item.schema.sorting,
        comments: true,
        autoWrapRow: true,
        autoWrapCol: true,
        licenseKey: 'non-commercial-and-evaluation',
        columns: col,
        readOnly: false,

        cells: function (row, column) {

            let cellPrp = this;

            if (col[column].data == 'default_row_delete') {
                cellPrp.renderer = deleteButton;
                cellPrp.readOnly = true;
                cellPrp.width = 60;
            }
            else if (col[column].data == 'default_row_edit1') {
                cellPrp.renderer = CustomeEdit1;
                cellPrp.readOnly = true;
                cellPrp.width = 60;
            }

            return cellPrp
        },

        copyPaste: {
            // enable the "Copy with headers" option in the context menu
            copyColumnHeaders: true,

            // enable the "Copy with group headers" option in the context menu
            copyColumnGroupHeaders: true,

            // enable the "Copy headers only" option in the context menu
            copyColumnHeadersOnly: true,
        },

        afterChange: afterChange,
        // afterDrawSelection:afterDrawSelection,
        // afterDocumentKeyDown:afterDocumentKeyDown,
        //   beforePaste:beforePaste,
        //   afterPaste:afterPaste,
        //  afterDeselect:afterDeselect,

        // Already Comment Field
        //   beforeRender:beforeRender,
        //   afterRender:afterRender,



        hiddenColumns: {
            columns: hidden_columns,
            indicators: true,
        },

        hiddenRows: {
            rows: hidden_rows,
            indicators: true
        },

    };



    props.item.reRender = reRender;
    props.item.setRowReadOnly = setRowReadOnly;
    props.item.getData = getData;
    props.item.setData = setData;
    props.item.setColumns = setColumns;
    props.item.addRow = addRow;
    props.item.setValueWiltColName = setValueWiltColName;
    props.item.getValueWiltColName = getValueWiltColName;
    props.item.getColumns = getColumns;
    props.item.hideColumn = hideColumn;
    let comp = <>
        <div className="loading" id="spinnerHns" style={{ display: "none" }}>Loading&#8230;</div>
        <HotTable key={props.item.schema.name} ref={hotRef} data={props.item.data} settings={settings} />

    </>

    return comp;
}
