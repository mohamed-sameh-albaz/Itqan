import './PostsPage.css';
import CommunityNavBar from "../components/CommunityNavBar";
import {Card, Avatar, Modal} from 'react-rainbow-components'
const PostsPage = () => {
    return ( <div style={{

    }}>
        <CommunityNavBar />

        <div className="he">
            
            <div className='post-header'>
            <Avatar src={"https://avatar.iran.liara.run/public"} />
            <span>Ziad Montaser</span>
            </div>
            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>

            <Modal id="modal-1" isOpen={true}>
                <h1>Hu</h1>
                    <img 
                    style={{width: '100%'}}
                        src="https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg"
                        className="rainbow-p-around_xx-large rainbow-m_auto rainbow-align-content_center"
                        alt="landscape with rainbows, birds and colorful balloons"
                    />
                </Modal>
        </div>
    </div> );
}
 
export default PostsPage;