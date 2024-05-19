import {Link} from 'react-router-dom'

export default function Footer() {
    return (
        <>
        <div className="footer">
            <Link to="/Contact" className='copyright clink'>Contact</Link>
            <p className="copyright">Copyright@ Ionut Luca</p>
        </div>
        </>
    )
}