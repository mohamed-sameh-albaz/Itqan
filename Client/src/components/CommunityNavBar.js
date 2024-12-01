import './CommunityNavBar.css'

const CommunityNavBar = () => {
    return ( <div className="community-navbar">
        <span>اتـــقــــــــــــــــان</span>

        <div className="items">
            <a>Leader Board</a>
            <a>Posts</a>

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