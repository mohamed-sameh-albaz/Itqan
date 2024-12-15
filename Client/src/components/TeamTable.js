import "./TeamTable.css"

const TeamTable = ({teams}) => {
    return (
      <table className="teamTable">
        <thead>
          <tr>
            <th>Teamname</th>
            <th>First member</th>
            <th>Second member</th>
            <th>Third member</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr>
              <td>{team.name}</td>
              <td>{team.firstmem}</td>
              <td>{team.secondmem}</td>
              <td>{team.thirdmem } </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
}
 
export default TeamTable;