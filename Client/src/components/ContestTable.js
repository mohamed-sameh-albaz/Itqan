import './ContestTable.css'

const ContestTable = ({contests}) => {
    return ( <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Start Date</th>
                <th>Duration</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {contests.map((e)=><tr>
                <td>{e.name}</td>
                <td>{e.startDate}</td>
                <td>{e.duration}</td>
                <td><a className=''> Go there</a></td>
            </tr>)}
        </tbody>


    </table> );
}
 
export default ContestTable;