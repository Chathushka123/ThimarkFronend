import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import filterFactory, { textFilter, numberFilter } from 'react-bootstrap-table2-filter';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import './__myCss.css'

function _Grid(props) {

//     let newRows = props.rows
//     let [columns, setColumns] = useState(props.columns)
//     useEffect(()=>{
//         setColumns(props.columns)
//     }, [props.columns])

//     let [rows, setRows] = useState(props.rows)
//     useEffect(()=>{
//         setRows(props.rows)
//     }, [props.rows])

//     let [minHeight, setMinHeight] = useState(props.minHeight)
//     useEffect(()=>{
//         setMinHeight(props.minHeight)
//     }, [props.minHeight])

//     let [enableCell, setEnableCell] = useState(props.enableCellSelect)
//     useEffect(()=>{
//         setEnableCell(props.enableCellSelect)
//     }, [props.enableCellSelect])

//     let [selectedCell, setSelectedCell] = useState()

//     let rowCount, setRowCount
//     [rowCount, setRowCount] = useState()
//     useEffect(()=>{
//         setRowCount(rowCount)
//     }, [rowCount])
//     if(typeof rows!== 'undefined'){
//         rowCount = (typeof props.rowCount === 'undefined') ? rows.length : props.rowCount
//     }

//     let [currentCell, setCurrentCell] = useState({})

//     columns.map(function(value, key){
            
//         switch(columns[key].type){
//             case "TextBox":
//                 console.log("TextBox")
//                 break
//             case "Label":
//                 console.log("Label")
//                 break
//             case "RadioGroup":
//                 console.log("RadioGroup")
//                 break
//             case "DropDown":
//                 console.log("DropDown")
//                 break
//             case "CheckBox":
//                 columns[key].formatter = formatCheckBox
//                 break
//             case "Button":
//                 console.log("Button")
//                 break
//             default:
//         }

//     })
// console.log("Checking Re render")
//     function cellSelected(cell){
//         let keysOfRow = Object.keys(columns[cell.idx])
//         console.log(columns)
//         rows[cell.rowIdx]["operating_name"] = rows[cell.rowIdx]["operating_name"] + currentCell.checkboxCheckdeValue


//         rows[cell.rowIdx][columns[cell.idx].key] = currentCell.checkboxCheckdeValue

//         setRows(rows)
//         console.log(currentCell.checkboxCheckdeValue)
//         console.log(cell)
//         console.log(keysOfRow)
//         console.log("New Rows comes here")
//         console.log(rows)
//         setSelectedCell(cell)
//         setCurrentCell({...currentCell, selectedCell: cell})
//         //props.cellSelected(cell)
//     }

//     function cellDeSelected(cell){
//         console.log(selectedCell)
//         setCurrentCell({...currentCell, selectedCell: {}})
//         setSelectedCell()
//         console.log(cell)

//     }

//     let getCellActions = (row, col) => {
//         setEnableCell(true)
//         // console.log(props.columns[event.idx])
//         // console.log(props.columns[event.idx].key)
//         // if(props.columns[event.idx].type==="CheckBox"){
            
//         //     console.log( props.rows[event.rowIdx][props.columns[event.idx].key])
//         //     props.rows[event.rowIdx][props.columns[event.idx].key] = false
//         // }
//         // if(rows.length > event.rowIdx)
//         // {
//         //     if((typeof columns[event.idx].editable !== 'undefined') && (typeof rows[event.rowIdx].editable !== 'undefined'))
//         //         if((columns[event.idx].editable === true) && (rows[event.rowIdx].editable ===  true ))
//         //             setEnableCell(true)
//         //         else
//         //             setEnableCell(false)
//         // }
//     }


    
//     let onGridRowsUpdated = (event) => {
//         console.log("onGridRowsUpdated!!!!!!!!!")
//         console.log(event)
//         let tempRows = rows.slice();
//         console.log(tempRows)
//         for (let i = event.fromRow; i <= event.toRow; i++) {
//             tempRows[i] = { ...tempRows[i], ...event.updated };
//         }
//         setRows(tempRows);
//         console.log("onGridRowsUpdate in Grid... : " + props.name)
//         console.log(event.updated)
//         console.log(rows)
        
//         props.onGridRowsUpdated(event)
//     }


//     function handleCheckboxChange(event){
//         console.log(props.rows)
//        console.log(newRows)
//         console.log("Handle Change ***************************")
//         let {type, checked} = event.target

//         let checkedValue = (checked?1:0)
//         setCurrentCell({...currentCell, event: event, checkboxCheckdeValue: checked})
//         //row.value = value
    
//         console.log(checked)
//         console.log(type)
//         //console.log(props.item.data)

//         // type === "checkbox" ? 
//         // props.item.data.value = checked :
//         // props.item.data.value = value

//         // if(typeof props.item.event.onChange !=='undefined') 
//         // {
//         //     props.item.event.onChange(event)
//         // }    

//         console.log("End Handle Change ***************************")
//     }


//     function formatCheckBox({value}){
//         console.log("Checking formatter......")
//         return <_CheckBox
//             type="checkbox"
//             checked= {value}
//             visible={true} 
//             showLabel = {false} 
//             onChange = {handleCheckboxChange} />   
//     }
//     function trialFormatter({value})
//     {
//         console.log("Trial Formatter###################")
//         console.log(value)
//     }

//     function rowActionsCell(){
//         console.log("rowActionsCell")
//         return null
//     }


    return <BootstrapTable keyField={props.keyField} data={ props.rows } columns={ props.columns }  filter={ filterFactory() }
        cellEdit={ cellEditFactory({ mode: 'dbclick',
        blurToSave: true }) }
        striped
        hover
        condensed/>;

}

export default _Grid