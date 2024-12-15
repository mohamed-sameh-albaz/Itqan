import { useNavigate, useParams } from 'react-router-dom';
import './CommunityNavBar.css'

const CommunityNavBar = () => {
    const nav = useNavigate();
    const parms = useParams();
    return ( <div className="community-navbar">
        <span className='cursor-pointer' onClick={()=>nav('/home')}>اتـــقــــــــــــــــان</span>

        <div className="items">
            <a>Leader Board</a>
            <a href={`/community/${parms.name}/posts`}>Posts</a>

            <div className="level-view">
                <div className="level-indecator">3</div>
                1200
            </div>

            <img
                src="https://avatar.iran.liara.run/public/boy"
                alt="Profile"
            />
        </div>
    </div> );
}
 
export default CommunityNavBar;