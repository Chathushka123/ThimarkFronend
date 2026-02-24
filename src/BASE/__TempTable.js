import React from "react"


function __TempTable(props){
    // let [value,setValue]= useState(props.value)
    // useEffect(()=>{
    //     setValue(props.value)
    // }, [props.value])

    // let [visible, setVisible] = useState(props.visible)
    // useEffect(()=>{
    //     setVisible(props.visible)
    // }, [props.visible])

    // function handleChange(event){
    //     setValue(event.target.value)
    //     if(typeof props.onChange !=='undefined') 
    //     {
    //         props.onChange(event)
    //     }
    // }

    // function handleBlur(event){
    //     if(typeof props.onBlur !=='undefined') 
    //     {
    //         props.onBlur(event)
    //     }
    // }

    console.log("Temp Table")
    return(
        
        <>
        <table className="table table-hover">
        <tr>
            <th>Firstname</th>
            <th>Lastname</th> 
            <th>Age</th>
        </tr>
        <tr>
            <td>Jill</td>
            <td>Smith</td> 
            <td>50</td>
        </tr>
        <tr>
            <td>Eve</td>
            <td>Jackson</td> 
            <td>94</td>
        </tr>
        </table>

</>
    )
}

export default __TempTable